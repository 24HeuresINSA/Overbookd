import { Injectable } from '@nestjs/common';
import {
  Gear,
  GearAlreadyExists,
  GearRepository,
  SearchGear,
} from '../interfaces';

class GearSearchBuilder {
  private ownerCondition = true;
  private slugCondition = true;
  private categoryContion = true;
  private gear: Gear;

  constructor(gear: Gear) {
    this.gear = gear;
  }

  addOwnerCondition(ownerSearch?: string) {
    this.ownerCondition = ownerSearch
      ? this.gear.owner?.slug?.includes(ownerSearch)
      : true;
    return this;
  }

  addSlugCondition(slugSearch?: string) {
    this.slugCondition = slugSearch
      ? this.gear.slug.includes(slugSearch)
      : true;
    return this;
  }

  addCategoryCondition(categorySearch?: string) {
    this.categoryContion = categorySearch
      ? this.gear.category?.slug?.includes(categorySearch)
      : true;
    return this;
  }

  get match(): boolean {
    return this.ownerCondition && this.slugCondition && this.categoryContion;
  }
}

@Injectable()
export class InMemoryGearRepository implements GearRepository {
  gears: Gear[] = [];

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

  searchGear(search: SearchGear): Promise<Gear[]> {
    return Promise.resolve(
      this.gears.filter((gear) => this.isMatchingSearch(search, gear)),
    );
  }

  private isMatchingSearch(
    { category, slug, owner }: SearchGear,
    gear: Gear,
  ): boolean {
    const search = new GearSearchBuilder(gear)
      .addCategoryCondition(category)
      .addSlugCondition(slug)
      .addOwnerCondition(owner);
    return search.match;
  }
}
