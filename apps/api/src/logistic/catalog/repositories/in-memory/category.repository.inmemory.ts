import { Injectable } from "@nestjs/common";
import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import { CategoryRepository } from "../catalog-repositories";
import { CategoryAlreadyExists } from "../../catalog.error";
import {
  CatalogCategory,
  CatalogCategoryTree,
  CategorySearchOptions,
} from "@overbookd/http";

class CategorySearchBuilder {
  private ownerCondition = true;
  private nameCondition = true;
  private category: CatalogCategory;

  constructor(category: CatalogCategory) {
    this.category = category;
  }

  addOwnerCondition(ownerSearch?: string) {
    this.ownerCondition = ownerSearch
      ? this.category.owner?.code?.includes(ownerSearch)
      : true;
    return this;
  }

  addNameCondition(nameSearch?: string) {
    this.nameCondition = nameSearch
      ? this.category.name.toLocaleLowerCase().includes(nameSearch)
      : true;
    return this;
  }

  get match(): boolean {
    return this.ownerCondition && this.nameCondition;
  }
}

@Injectable()
export class InMemoryCategoryRepository implements CategoryRepository {
  categories: CatalogCategory[] = [];

  getCategory(id: number): Promise<CatalogCategory | undefined> {
    return Promise.resolve(
      this.categories.find((categorie) => categorie.id === id),
    );
  }

  getSubCategories(parentId: number): Promise<CatalogCategory[]> {
    return Promise.resolve(
      this.categories.filter((category) => category.parent === parentId),
    );
  }

  async addCategory(
    category: Omit<CatalogCategory, "id">,
  ): Promise<CatalogCategory> {
    const existingCategory = this.categories.find(
      (categ) => categ.path === category.path,
    );
    if (existingCategory) throw new CategoryAlreadyExists(existingCategory);
    const id = this.categories.length + 1;
    const createdCategory = {
      ...category,
      id,
    };
    this.categories = [...this.categories, createdCategory];
    return Promise.resolve(createdCategory);
  }

  removeCategory(id: number): Promise<CatalogCategory | undefined> {
    const categoryIndex = this.categories.findIndex(
      (category) => category.id === id,
    );
    if (categoryIndex === -1) return Promise.resolve(undefined);
    const category = this.categories.at(categoryIndex);
    this.categories = removeItemAtIndex(this.categories, categoryIndex);
    return Promise.resolve(category);
  }

  updateCategories(categories: CatalogCategory[]): Promise<CatalogCategory[]> {
    return Promise.all(
      categories.map((category) => this.updateCategory(category)),
    );
  }

  updateCategory(category: CatalogCategory): Promise<CatalogCategory> {
    const categoryIndex = this.categories.findIndex(
      (categ) => categ.id === category.id,
    );
    if (categoryIndex === -1) return Promise.resolve(undefined);
    this.categories = updateItemToList(
      this.categories,
      categoryIndex,
      category,
    );
    return Promise.resolve(category);
  }

  getCategoryTrees(): Promise<CatalogCategoryTree[]> {
    const mainCategories = this.categories.filter(
      (category) => !category.parent,
    );
    return this.buildCategoriesTree(mainCategories);
  }

  private async buildCategoriesTree(
    categories: CatalogCategory[],
  ): Promise<CatalogCategoryTree[]> {
    return Promise.all(
      categories.map(async (category) => {
        const subCategories = await this.getSubCategories(category.id);
        const subCategoriesTree = await this.buildCategoriesTree(subCategories);
        return { ...category, subCategories: subCategoriesTree };
      }),
    );
  }

  searchCategory({
    name,
    owner,
  }: CategorySearchOptions): Promise<CatalogCategory[]> {
    return Promise.resolve(
      this.categories.filter((category) => {
        const search = new CategorySearchBuilder(category)
          .addNameCondition(name)
          .addOwnerCondition(owner);
        return search.match;
      }),
    );
  }
}
