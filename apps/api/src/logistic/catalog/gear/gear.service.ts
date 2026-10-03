import { Injectable } from "@nestjs/common";
import {
  CatalogCategory,
  CatalogGear,
  GearSearchOptions,
  CatalogGearManager,
  CategoryNotFound,
} from "@overbookd/logistic";
import { CatalogGearForm } from "@overbookd/http";

export type FindCatalogCategories = {
  findById(categoryId: number): Promise<CatalogCategory | undefined>;
};

@Injectable()
export class CatalogGearService {
  constructor(
    private readonly catalog: CatalogGearManager,
    private readonly categories: FindCatalogCategories,
  ) {}

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

  async find(id: number): Promise<CatalogGear | undefined> {
    return this.catalog.getGear(id);
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

  async search(searchOptions: GearSearchOptions): Promise<CatalogGear[]> {
    return this.catalog.searchGear(searchOptions);
  }
}
