import { SlugifyService } from "@overbookd/slugify";
import {
  CatalogGear,
  GearLinkedItems,
  GearSearchOptions,
  SavedCatalogGear,
} from "./gear";
import { CatalogCategory } from "../category/category";
import { GearNotFound } from "../../logistic.error";
import { GearAlreadyExists, GearHasLinkedItems } from "../catalog.error";
import { GearReferenceCodeGenerator } from "./gear-reference-code";

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
  findById(id: number): Promise<SavedCatalogGear | undefined>;
  findBySlug(slug: string): Promise<SavedCatalogGear | undefined>;
  getLastId(): Promise<number>;
  addGear(gear: Omit<SavedCatalogGear, "id">): Promise<SavedCatalogGear>;
  updateGear(gear: SavedCatalogGear): Promise<SavedCatalogGear | undefined>;
  removeGear(id: number): Promise<void>;
  searchGear(searchedGear: GearSearchOptions): Promise<SavedCatalogGear[]>;
  getLinkedItems(id: number): Promise<Partial<GearLinkedItems>>;
};

export class CatalogGearManager {
  constructor(private readonly gear: CatalogGears) {}

  async find(id: number): Promise<CatalogGear> {
    const gear = await this.gear.findById(id);
    if (!gear) throw new GearNotFound(id);
    return this.computeGearCode(gear);
  }

  async add({
    name,
    category,
    isPonctualUsage,
    isConsumable,
  }: CatalogGearToAdd): Promise<CatalogGear> {
    const existingGear = await this.gear.findBySlug(SlugifyService.apply(name));
    if (existingGear) throw new GearAlreadyExists(existingGear.name);

    const newGear = await this.gear.addGear({
      name,
      category,
      owner: category?.owner,
      slug: SlugifyService.apply(name),
      isPonctualUsage,
      isConsumable,
    });
    return this.computeGearCode(newGear);
  }

  async update(gear: CatalogGearToUpdate): Promise<CatalogGear> {
    const updatedGear = await this.gear.updateGear({
      ...gear,
      slug: SlugifyService.apply(gear.name),
      category: gear.category,
      owner: gear.category?.owner,
    });
    if (!updatedGear) throw new GearNotFound(gear.id);
    return this.computeGearCode(updatedGear);
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

  async search(searchOptions: GearSearchOptions): Promise<CatalogGear[]> {
    return this.gear.searchGear(searchOptions);
  }

  private computeGearCode(gear: SavedCatalogGear): CatalogGear {
    if (!gear.category) return gear;
    return {
      ...gear,
      code: GearReferenceCodeGenerator.generate(gear.category, gear.id),
    };
  }
}
