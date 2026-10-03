import {
  CatalogCategory,
  CatalogCategoryTree,
  CategorySearchOptions,
  CategoryOwner,
} from "../category.js";
import {
  GearLinkedItems,
  GearSearchOptions,
  SavedCatalogGear,
} from "../gear.js";

export type CatalogGears = {
  findBySlug(slug: string): Promise<SavedCatalogGear | undefined>;
  getLastId(): Promise<number>;
  addGear(gear: Omit<SavedCatalogGear, "id">): Promise<SavedCatalogGear>;
  updateGear(gear: SavedCatalogGear): Promise<SavedCatalogGear | undefined>;
  removeGear(id: number): Promise<void>;
  searchGear(searchedGear: GearSearchOptions): Promise<SavedCatalogGear[]>;
  getLinkedItems(id: number): Promise<Partial<GearLinkedItems>>;
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
