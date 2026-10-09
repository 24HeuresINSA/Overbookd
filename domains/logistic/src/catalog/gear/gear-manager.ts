import { SlugifyService } from "@overbookd/slugify";
import { CatalogGear, GearLinkedItems, SavedCatalogGear } from "./gear";
import { CatalogCategory } from "../category/category";
import { GearNotFound } from "../../logistic.error";
import { GearAlreadyExists, GearHasLinkedItems } from "../catalog.error";

type CatalogGearToAdd = {
  name: string;
  category?: CatalogCategory;
  isPonctualUsage: boolean;
  isConsumable: boolean;
};

type CatalogGearToUpdate = CatalogGearToAdd & {
  id: number;
};

export type CatalogGears = {
  findById(id: number): Promise<CatalogGear | undefined>;
  findBySlug(slug: string): Promise<CatalogGear | undefined>;
  addGear(gear: Omit<SavedCatalogGear, "id">): Promise<CatalogGear>;
  updateGear(gear: SavedCatalogGear): Promise<CatalogGear | undefined>;
  removeGear(id: number): Promise<void>;
  getLinkedItems(id: number): Promise<Partial<GearLinkedItems>>;
};

export class CatalogGearManager {
  constructor(private readonly gear: CatalogGears) {}

  async find(id: number): Promise<CatalogGear> {
    const gear = await this.gear.findById(id);
    if (!gear) throw new GearNotFound(id);
    return gear;
  }

  async add({
    name,
    category,
    isPonctualUsage,
    isConsumable,
  }: CatalogGearToAdd): Promise<CatalogGear> {
    const existingGear = await this.gear.findBySlug(SlugifyService.apply(name));
    if (existingGear) throw new GearAlreadyExists(existingGear.name);

    return this.gear.addGear({
      name,
      category,
      owner: category?.owner,
      slug: SlugifyService.apply(name),
      isPonctualUsage,
      isConsumable,
    });
  }

  async update(gear: CatalogGearToUpdate): Promise<CatalogGear> {
    const updatedGear = await this.gear.updateGear({
      ...gear,
      slug: SlugifyService.apply(gear.name),
      category: gear.category,
      owner: gear.category?.owner,
    });
    if (!updatedGear) throw new GearNotFound(gear.id);
    return updatedGear;
  }

  async remove(id: number): Promise<void> {
    const linked = await this.gear.getLinkedItems(id);
    const activities = linked.activities ?? [];
    const tasks = linked.tasks ?? [];
    const borrows = linked.borrows ?? [];
    const hasLinkedItems = activities.length || tasks.length || borrows.length;

    if (hasLinkedItems) {
      const activitiesLabel = activities.map((id) => `FA ${id}`);
      const tasksLabel = tasks.map((id) => `FT ${id}`);
      const borrowsLabel = borrows.map((id) => `Fiche Emprunt ${id}`);
      const allLinkedItems = [
        ...activitiesLabel,
        ...tasksLabel,
        ...borrowsLabel,
      ];
      throw new GearHasLinkedItems(allLinkedItems);
    }

    return this.gear.removeGear(id);
  }
}
