import { Injectable } from "@nestjs/common";
import {
  CatalogCategory,
  CatalogGear,
  GearSearchOptions,
  CatalogGearManager,
  CategoryNotFound,
} from "@overbookd/logistic";
import { CatalogGearForm } from "@overbookd/http";
import { SearchGears } from "../../common/search-gears";

export type FindCatalogCategories = {
  findById(categoryId: number): Promise<CatalogCategory | undefined>;
};

@Injectable()
export class CatalogGearService {
  constructor(
    private readonly catalog: CatalogGearManager,
    private readonly categories: FindCatalogCategories,
    private readonly search: SearchGears,
  ) {}

  async find(id: number): Promise<CatalogGear | undefined> {
    return this.catalog.find(id);
  }

  async searchGear(searchOptions: GearSearchOptions): Promise<CatalogGear[]> {
    return this.search.search(searchOptions);
  }

  async add({
    name,
    categoryId,
    isPonctualUsage,
    isConsumable,
  }: CatalogGearForm): Promise<CatalogGear> {
    const category = await this.categories.findById(categoryId);
    if (!category) throw new CategoryNotFound(categoryId);

    return this.catalog.add({
      name,
      category,
      isPonctualUsage,
      isConsumable,
    });
  }

  async update(gear: { id: number } & CatalogGearForm): Promise<CatalogGear> {
    const category = await this.categories.findById(gear.categoryId);
    if (!category) throw new CategoryNotFound(gear.categoryId);

    return this.catalog.update({
      id: gear.id,
      name: gear.name,
      isPonctualUsage: gear.isPonctualUsage,
      isConsumable: gear.isConsumable,
      category,
    });
  }

  async remove(id: number): Promise<void> {
    return this.catalog.remove(id);
  }
}
