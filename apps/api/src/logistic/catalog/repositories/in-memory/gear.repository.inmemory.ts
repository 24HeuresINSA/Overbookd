import { Injectable } from "@nestjs/common";
import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import { GearReferenceCodeService } from "../../gear-reference-code.service";
import { GearLinkedItems, GearNotFoundException } from "../../catalog.service";
import { GearRepository } from "../catalog-repositories";
import { GearAlreadyExists } from "../../catalog.error";
import { CatalogGear, GearSearchOptions } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import { GearSearchBuilder } from "../../../common/gear-search.builder";

export type CatalogGearWithLinkedItems = CatalogGear & GearLinkedItems;

export const EMPTY_GEAR_LINKED_ITEMS = {
  tasks: [],
  actitivities: [],
  borrows: [],
  purchases: [],
};

@Injectable()
export class InMemoryGearRepository implements GearRepository {
  gears: CatalogGearWithLinkedItems[] = [];

  getGear(id: number): Promise<CatalogGear | undefined> {
    const gear = this.gears.find((gear) => gear.id === id);
    if (!gear) return Promise.reject(new GearNotFoundException(id));
    return Promise.resolve(gear);
  }

  addGear(gear: Omit<CatalogGear, "id">): Promise<CatalogGear> {
    const existingGear = this.gears.find((g) => g.slug === gear.slug);
    if (existingGear) throw new GearAlreadyExists(existingGear);
    const id = this.gears.length + 1;
    const code = gear.category
      ? GearReferenceCodeService.computeGearCode(gear.category, id)
      : undefined;
    const createdGear = { ...gear, id, code, ...EMPTY_GEAR_LINKED_ITEMS };
    this.gears = [...this.gears, createdGear];
    return Promise.resolve(createdGear);
  }

  updateGear(
    gear: Omit<CatalogGear, "owner">,
  ): Promise<CatalogGear | undefined> {
    const gearIndex = this.gears.findIndex((g) => g.id === gear.id);
    if (gearIndex === -1) return Promise.resolve(undefined);
    const toUpdate = { ...gear, ...EMPTY_GEAR_LINKED_ITEMS };
    this.gears = updateItemToList(this.gears, gearIndex, toUpdate);
    return Promise.resolve(toUpdate);
  }

  removeGear(id: number): Promise<void> {
    const gearIndex = this.gears.findIndex((gear) => gear.id === id);
    if (gearIndex === -1) return Promise.resolve();
    this.gears = removeItemAtIndex(this.gears, gearIndex);
    return Promise.resolve();
  }

  getLinkedItems(id: number): Promise<GearLinkedItems | undefined> {
    const gear = this.gears.find((g) => g.id === id);
    return Promise.resolve(gear);
  }

  searchGear(options: GearSearchOptions): Promise<CatalogGear[]> {
    return Promise.resolve(
      this.gears.filter((gear) => this.isMatchingSearch(options, gear)),
    );
  }

  private isMatchingSearch(
    { category, search, owner, ponctualUsage }: GearSearchOptions,
    gear: CatalogGear,
  ): boolean {
    const slug = SlugifyService.applyOnOptional(search);
    const categorySlug = SlugifyService.applyOnOptional(category);
    const ownerSlug = SlugifyService.applyOnOptional(owner);

    const gearSearch = new GearSearchBuilder(gear)
      .addCategoryCondition(categorySlug)
      .addSlugCondition(slug)
      .addOwnerCondition(ownerSlug)
      .addPonctualUsageCondition(ponctualUsage);
    return gearSearch.match;
  }
}
