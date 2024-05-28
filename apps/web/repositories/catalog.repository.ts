import {
  CategoryForm,
  CategorySearchOptions,
  CatalogGear,
  GearSearchOptions,
  CatalogCategory,
  CatalogCategoryTree,
  CatalogGearForm,
} from "@overbookd/http";
import { Context } from "../utils/api/axios";

export class GearsRepository {
  private static readonly basePath = "logistic/gears";

  static searchGears(context: Context, searchOptions?: GearSearchOptions) {
    return context.$axios.get<CatalogGear[]>(this.basePath, {
      params: searchOptions,
    });
  }

  static createGear(context: Context, gearForm: CatalogGearForm) {
    return context.$axios.post<CatalogGear>(this.basePath, gearForm);
  }

  static updateGear(
    context: Context,
    gearId: number,
    gearForm: CatalogGearForm,
  ) {
    return context.$axios.put<CatalogGear>(
      `${this.basePath}/${gearId}`,
      gearForm,
    );
  }

  static deleteGear(context: Context, gearId: number) {
    return context.$axios.$delete(`${this.basePath}/${gearId}`);
  }
}

export class CategoryRepository {
  private static readonly basePath = "logistic/categories";

  static searchCategories(
    context: Context,
    searchOptions?: CategorySearchOptions,
  ) {
    return context.$axios.get<CatalogCategory[]>(this.basePath, {
      params: searchOptions,
    });
  }

  static getCategoryTree(context: Context) {
    return context.$axios.get<CatalogCategoryTree[]>(`${this.basePath}/tree`);
  }

  static createCategory(context: Context, categoryForm: CategoryForm) {
    return context.$axios.post<CatalogCategory>(this.basePath, categoryForm);
  }

  static updateCategory(
    context: Context,
    categoryId: number,
    categoryForm: CategoryForm,
  ) {
    return context.$axios.put<CatalogCategory>(
      `${this.basePath}/${categoryId}`,
      categoryForm,
    );
  }

  static deleteCategory(context: Context, categoryId: number) {
    return context.$axios.$delete(`${this.basePath}/${categoryId}`);
  }

  static getCategory(context: Context, categoryId: number) {
    return context.$axios.get<CatalogCategory>(
      `${this.basePath}/${categoryId}`,
    );
  }
}
