import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  CategoryForm,
  CategorySearchOptions,
  GearSearchOptions,
} from "~/store/catalog";
import { Category, CategoryTree, Gear } from "~/utils/models/catalog.model";

export type Context = { $axios: NuxtAxiosInstance };

export class GearsRepository {
  private static readonly basePath = "gears";

  static searchGears(context: Context, searchOptions?: GearSearchOptions) {
    return context.$axios.get<Gear[]>(this.basePath, { params: searchOptions });
  }
}

export class CategoryRepository {
  private static readonly basePath = "categories";

  static searchCategories(
    context: Context,
    searchOptions?: CategorySearchOptions
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
}
