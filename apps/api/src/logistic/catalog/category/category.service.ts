import { Injectable } from "@nestjs/common";
import {
  CatalogCategory,
  CatalogCategoryTree,
  CategoryForm,
  CategorySearchOptions,
  CatalogCategoryManager,
} from "@overbookd/logistic";

type UpdateCategoryForm = CategoryForm & { id: number };

@Injectable()
export class CatalogCategoryService {
  constructor(private readonly catalog: CatalogCategoryManager) {}

  async create(category: CategoryForm): Promise<CatalogCategory> {
    return this.catalog.create(category);
  }

  async update(category: UpdateCategoryForm): Promise<CatalogCategory> {
    return this.catalog.update(category);
  }

  async find(id: number): Promise<CatalogCategory> {
    return this.catalog.find(id);
  }

  async getAll(): Promise<CatalogCategoryTree[]> {
    return this.catalog.getAll();
  }

  async remove(id: number): Promise<void> {
    return this.catalog.remove(id);
  }

  search(searchOptions: CategorySearchOptions): Promise<CatalogCategory[]> {
    return this.catalog.search(searchOptions);
  }
}
