import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { GearSearchOptions } from "@overbookd/http";
import { CategoryForm, CategorySearchOptions } from "~/store/catalog";
import { GearForm } from "~/store/catalogGear";
import { Category, CategoryTree, Gear } from "~/utils/models/catalog.model";

export type Context = { $axios: NuxtAxiosInstance };

export class GearsRepository {
  private static readonly basePath = "logistic/gears";

  static searchGears(context: Context, searchOptions?: GearSearchOptions) {
    return context.$axios.get<Gear[]>(this.basePath, { params: searchOptions });
  }

  static createGear(context: Context, gearForm: GearForm) {
    return context.$axios.post<Gear>(this.basePath, gearForm);
  }

  static updateGear(context: Context, gearId: number, gearForm: GearForm) {
    return context.$axios.put<Gear>(`${this.basePath}/${gearId}`, gearForm);
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
    return context.$axios.get<Category[]>(this.basePath, {
      params: searchOptions,
    });
  }

  static getCategoryTree(context: Context) {
    return context.$axios.get<CategoryTree[]>(`${this.basePath}/tree`);
  }

  static createCategory(context: Context, categoryForm: CategoryForm) {
    return context.$axios.post<Category>(this.basePath, categoryForm);
  }

  static updateCategory(
    context: Context,
    categoryId: number,
    categoryForm: CategoryForm,
  ) {
    return context.$axios.put<Category>(
      `${this.basePath}/${categoryId}`,
      categoryForm,
    );
  }

  static deleteCategory(context: Context, categoryId: number) {
    return context.$axios.$delete(`${this.basePath}/${categoryId}`);
  }

  static getCategory(context: Context, categoryId: number) {
    return context.$axios.get<Category>(`${this.basePath}/${categoryId}`);
  }
}
