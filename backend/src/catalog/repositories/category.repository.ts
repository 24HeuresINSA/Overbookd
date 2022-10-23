import { Category, CategoryRepository } from '../interfaces';

export class InMemoryCategoryRepository implements CategoryRepository {
  categories: Category[];

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

  addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const id = this.categories.length + 1;
    const createdCategory = {
      ...category,
      id,
    };
    this.categories.push(createdCategory);
    return Promise.resolve(createdCategory);
  }

  removeCategory(id: number): Promise<Category | undefined> {
    const categoryIndex = this.categories.findIndex(
      (category) => category.id === id,
    );
    if (categoryIndex === -1) return Promise.resolve(undefined);
    const category = this.categories[categoryIndex];
    this.categories = [
      ...this.categories.slice(0, categoryIndex),
      ...this.categories.slice(categoryIndex + 1),
    ];
    return Promise.resolve(category);
  }

  updateCategories(categories: Category[]): Promise<Category[]> {
    return Promise.all(
      categories.map((category) => this.updateCategory(category)),
    );
  }

  private updateCategory(category: Category): Promise<Category> {
    const categoryIndex = this.categories.findIndex(
      (categ) => categ.id === category.id,
    );
    this.categories[categoryIndex] = category;
    return Promise.resolve(category);
  }
}
