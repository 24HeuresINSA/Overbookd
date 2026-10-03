import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import { GearLinkedItems, SavedCatalogGear } from "./gear.js";
import { CatalogGears } from "./gear-manager.js";

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

  findById(id: number): Promise<SavedCatalogGear | undefined> {
    const gear = this.gears.find((gear) => gear.id === id);
    return Promise.resolve(gear);
  }

  findBySlug(slug: string): Promise<SavedCatalogGear | undefined> {
    const gear = this.gears.find((gear) => gear.slug === slug);
    if (!gear) return Promise.resolve(undefined);
    return Promise.resolve(gear);
  }

  getLastId(): Promise<number> {
    const lastGearId = this.gears.reduce(
      (max, gear) => (gear.id > max ? gear.id : max),
      0,
    );
    return Promise.resolve(lastGearId ?? 0);
  }

  async addGear(gear: Omit<SavedCatalogGear, "id">): Promise<SavedCatalogGear> {
    const id = (await this.getLastId()) + 1;
    const createdGear = { ...gear, id };
    this.gears = [...this.gears, createdGear];
    return Promise.resolve(createdGear);
  }

  updateGear(gear: SavedCatalogGear): Promise<SavedCatalogGear | undefined> {
    const gearIndex = this.gears.findIndex((g) => g.id === gear.id);
    if (gearIndex === -1) return Promise.resolve(undefined);
    const toUpdate = { ...this.gears[gearIndex], ...gear };
    this.gears = updateItemToList(this.gears, gearIndex, toUpdate);
    return Promise.resolve(toUpdate);
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

  get savedGears() {
    return this.gears;
  }
}
