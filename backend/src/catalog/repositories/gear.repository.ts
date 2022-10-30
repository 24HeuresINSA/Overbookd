import { Gear, GearAlreadyExists, GearRepository } from '../interfaces';
export class InMemoryGearRepository implements GearRepository {
  gears: Gear[];

  getGear(id: number): Promise<Gear | undefined> {
    return Promise.resolve(this.gears.find((gear) => gear.id === id));
  }

  addGear(gear: Omit<Gear, 'id'>): Promise<Gear> {
    const existingGear = this.gears.find((g) => g.slug === gear.slug);
    if (existingGear) throw new GearAlreadyExists(existingGear);
    const id = this.gears.length + 1;
    const createdGear = { ...gear, id };
    this.gears.push(createdGear);
    return Promise.resolve(createdGear);
  }

  updateGear(gear: Gear): Promise<Gear | undefined> {
    const gearIndex = this.gears.findIndex((g) => g.id === gear.id);
    if (gearIndex === -1) return Promise.resolve(undefined);
    this.gears[gearIndex] = gear;
    return Promise.resolve(gear);
  }

  removeGear(id: number): Promise<void> {
    const gearIndex = this.gears.findIndex((gear) => gear.id === id);
    if (gearIndex === -1) return Promise.resolve();
    this.gears = [
      ...this.gears.slice(0, gearIndex),
      ...this.gears.slice(gearIndex + 1),
    ];
    return Promise.resolve();
  }
}
