import {
  CatalogCategory,
  CatalogCategoryTree,
  CatalogGear,
  CategoryOwner,
  CategorySearchOptions,
  GearSearchOptions,
} from "@overbookd/http";
import { GearLinkedItems } from "../catalog.service";

export type GearRepository = {
  getGear(id: number): Promise<CatalogGear>;
  addGear(gear: Omit<CatalogGear, "id">): Promise<CatalogGear | undefined>;
  updateGear(
    gear: Omit<CatalogGear, "owner">,
  ): Promise<CatalogGear | undefined>;
  removeGear(id: number): Promise<void>;
  searchGear(searchedGear: GearSearchOptions): Promise<CatalogGear[]>;
  getLinkedItems(id: number): Promise<GearLinkedItems | undefined>;
};

export type CategoryRepository = {
  getCategory(id: number): Promise<CatalogCategory | undefined>;
  getSubCategories(parentId: number): Promise<CatalogCategory[] | undefined>;
  addCategory(category: Omit<CatalogCategory, "id">): Promise<CatalogCategory>;
  removeCategory(id: number): Promise<CatalogCategory | undefined>;
  updateCategories(
    categories: CatalogCategory[],
  ): Promise<CatalogCategory[] | undefined>;
  updateCategory(
    category: CatalogCategory,
  ): Promise<CatalogCategory | undefined>;
  getCategoryTrees(): Promise<CatalogCategoryTree[] | undefined>;
  searchCategory(
    searchedCategory: CategorySearchOptions,
  ): Promise<CatalogCategory[]>;
};

export type TeamRepository = {
  getTeam(code: string): Promise<CategoryOwner | undefined>;
};
