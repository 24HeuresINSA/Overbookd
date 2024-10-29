import type {
  CategoryForm,
  CategorySearchOptions,
  CatalogGear,
  GearSearchOptions,
  CatalogCategory,
  CatalogCategoryTree,
  CatalogGearForm,
} from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class GearsRepository {
  private static readonly basePath = "logistic/gears";

  static searchGears(searchOptions?: GearSearchOptions) {
    return HttpClient.get<CatalogGear[]>({
      path: this.basePath,
      params: searchOptions,
    });
  }

  static createGear(gearForm: CatalogGearForm) {
    return HttpClient.post<CatalogGear>(this.basePath, gearForm);
  }

  static updateGear(gearId: number, gearForm: CatalogGearForm) {
    return HttpClient.put<CatalogGear>(`${this.basePath}/${gearId}`, gearForm);
  }

  static deleteGear(gearId: number) {
    return HttpClient.delete(`${this.basePath}/${gearId}`);
  }
}

export class CategoryRepository {
  private static readonly basePath = "logistic/categories";

  static searchCategories(searchOptions?: CategorySearchOptions) {
    return HttpClient.get<CatalogCategory[]>({
      path: this.basePath,
      params: searchOptions,
    });
  }

  static getCategoryTree() {
    return HttpClient.get<CatalogCategoryTree[]>(`${this.basePath}/tree`);
  }

  static createCategory(categoryForm: CategoryForm) {
    return HttpClient.post<CatalogCategory>(this.basePath, categoryForm);
  }

  static updateCategory(categoryId: number, categoryForm: CategoryForm) {
    return HttpClient.put<CatalogCategory>(
      `${this.basePath}/${categoryId}`,
      categoryForm,
    );
  }

  static removeCategory(categoryId: number) {
    return HttpClient.delete(`${this.basePath}/${categoryId}`);
  }

  static getCategory(categoryId: number) {
    return HttpClient.get<CatalogCategory>(`${this.basePath}/${categoryId}`);
  }
}
