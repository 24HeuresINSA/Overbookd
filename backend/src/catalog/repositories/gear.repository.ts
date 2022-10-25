import { Gear, GearRepository } from '../interfaces';

export class InMemoryGearRepository implements GearRepository {
  gears: Gear[];

  getGear(id: number): Promise<Gear | undefined> {
    return Promise.resolve(this.gears.find((gear) => gear.id === id));
  }

  addGear(gear: Omit<Gear, 'id'>): Promise<Gear> {
    const id = this.gears.length + 1;
    const createdGear = { ...gear, id };
    this.gears.push(createdGear);
    return Promise.resolve(createdGear);
  }
}
