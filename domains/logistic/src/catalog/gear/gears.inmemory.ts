import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import { CatalogGear, GearLinkedItems, SavedCatalogGear } from "./gear.js";
import { CatalogGears } from "./gear-manager.js";
import { GearReferenceCodeGenerator } from "./gear-reference-code.js";

export const EMPTY_GEAR_LINKED_ITEMS = {
  tasks: [],
  activities: [],
  borrows: [],
};

export class InMemoryCatalogGears implements CatalogGears {
  constructor(
    private gears: SavedCatalogGear[] = [],
    private linkedItems: Record<number, GearLinkedItems> = {},
  ) {}

  findById(id: number): Promise<CatalogGear | undefined> {
    const gear = this.gears.find((gear) => gear.id === id);
    if (!gear) return Promise.resolve(undefined);
    return Promise.resolve(this.computeGearCode(gear));
  }

  findBySlug(slug: string): Promise<CatalogGear | undefined> {
    const gear = this.gears.find((gear) => gear.slug === slug);
    if (!gear) return Promise.resolve(undefined);
    return Promise.resolve(this.computeGearCode(gear));
  }

  private generateId(): number {
    return this.gears.reduce((maxId, gear) => Math.max(maxId, gear.id), 0) + 1;
  }

  async addGear(gear: Omit<SavedCatalogGear, "id">): Promise<CatalogGear> {
    const id = this.generateId();
    const createdGear = { ...gear, id };
    this.gears = [...this.gears, createdGear];
    return Promise.resolve(this.computeGearCode(createdGear));
  }

  updateGear(gear: SavedCatalogGear): Promise<CatalogGear | undefined> {
    const gearIndex = this.gears.findIndex((g) => g.id === gear.id);
    if (gearIndex === -1) return Promise.resolve(undefined);
    const toUpdate = { ...this.gears[gearIndex], ...gear };
    this.gears = updateItemToList(this.gears, gearIndex, toUpdate);
    return Promise.resolve(this.computeGearCode(toUpdate));
  }

  removeGear(id: number): Promise<void> {
    const gearIndex = this.gears.findIndex((gear) => gear.id === id);
    if (gearIndex === -1) return Promise.resolve();
    this.gears = removeItemAtIndex(this.gears, gearIndex);
    return Promise.resolve();
  }

  getLinkedItems(id: number): Promise<Partial<GearLinkedItems>> {
    return Promise.resolve({ ...this.linkedItems[id] });
  }

  private computeGearCode(gear: SavedCatalogGear): CatalogGear {
    if (!gear.category) return gear;
    return {
      ...gear,
      code: GearReferenceCodeGenerator.generate(gear.category, gear.id),
    };
  }

  get savedGears() {
    return this.gears;
  }
}
