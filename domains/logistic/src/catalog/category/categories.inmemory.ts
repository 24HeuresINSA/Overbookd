import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import { CategoryAlreadyExists, CategoryNotFound } from "../catalog.error.js";
import {
  CatalogCategory,
  CatalogCategoryTree,
  CategorySearchOptions,
} from "./category.js";
import { CatalogCategories } from "./category-manager.js";

class CategorySearchBuilder {
  private ownerCondition = true;
  private nameCondition = true;
  private category: CatalogCategory;

  constructor(category: CatalogCategory) {
    this.category = category;
  }

  addOwnerCondition(ownerSearch?: string) {
    this.ownerCondition = ownerSearch
      ? (this.category.owner?.code?.includes(ownerSearch) ?? false)
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

export class InMemoryCatalogCategories implements CatalogCategories {
  constructor(private categories: CatalogCategory[]) {}

  private generateId(): number {
    return (
      this.categories.reduce(
        (maxId, category) => Math.max(maxId, category.id),
        0,
      ) + 1
    );
  }

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
      ({ name }) =>
        SlugifyService.apply(name) === SlugifyService.apply(category.name),
    );
    if (existingCategory) {
      throw new CategoryAlreadyExists(existingCategory.name);
    }
  
    const createdCategory: CatalogCategory = {
      ...category,
      id: this.generateId(),
    };
    this.categories = [...this.categories, createdCategory];
    return createdCategory;
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
    if (categoryIndex === -1) throw new CategoryNotFound(category.id);
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
