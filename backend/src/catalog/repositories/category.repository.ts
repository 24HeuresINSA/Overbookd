import { Category, CategoryRepository } from '../interfaces';

export class InMemoryCategoryRepository implements CategoryRepository {
  categories: Category[];
  getCategory(id: number): Promise<Category | undefined> {
    return Promise.resolve(
      this.categories.find((categorie) => categorie.id === id),
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
}
