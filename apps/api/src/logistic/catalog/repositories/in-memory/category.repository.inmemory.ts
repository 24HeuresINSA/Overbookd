import { Injectable } from "@nestjs/common";
import { removeItemAtIndex, updateItemToList } from "@overbookd/list";
import {
  Category,
  CategoryAlreadyExists,
  CategoryRepository,
  CategoryTree,
  SearchCategory,
} from "../../types";

class CategorySearchBuilder {
  private ownerCondition = true;
  private nameCondition = true;
  private category: Category;

  constructor(category: Category) {
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
  categories: Category[] = [];

  getCategory(id: number): Promise<Category | undefined> {
    return Promise.resolve(
      this.categories.find((categorie) => categorie.id === id),
    );
  }

  getSubCategories(parentId: number): Promise<Category[]> {
    return Promise.resolve(
      this.categories.filter((category) => category.parent === parentId),
    );
  }

  async addCategory(category: Omit<Category, "id">): Promise<Category> {
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

  removeCategory(id: number): Promise<Category | undefined> {
    const categoryIndex = this.categories.findIndex(
      (category) => category.id === id,
    );
    if (categoryIndex === -1) return Promise.resolve(undefined);
    const category = this.categories.at(categoryIndex);
    this.categories = removeItemAtIndex(this.categories, categoryIndex);
    return Promise.resolve(category);
  }

  updateCategories(categories: Category[]): Promise<Category[]> {
    return Promise.all(
      categories.map((category) => this.updateCategory(category)),
    );
  }

  updateCategory(category: Category): Promise<Category> {
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

  getCategoryTrees(): Promise<CategoryTree[]> {
    const mainCategories = this.categories.filter(
      (category) => !category.parent,
    );
    return this.buildCategoriesTree(mainCategories);
  }

  private async buildCategoriesTree(
    categories: Category[],
  ): Promise<CategoryTree[]> {
    return Promise.all(
      categories.map(async (category) => {
        const subCategories = await this.getSubCategories(category.id);
        const subCategoriesTree = await this.buildCategoriesTree(subCategories);
        return { ...category, subCategories: subCategoriesTree };
      }),
    );
  }

  searchCategory({ name, owner }: SearchCategory): Promise<Category[]> {
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
