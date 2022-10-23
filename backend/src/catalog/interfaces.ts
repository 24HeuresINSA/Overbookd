export interface Category {
  id: number;
  name: string;
  slug: string;
  owner?: Team;
  parent?: number;
}

export interface Team {
  id: number;
  name: string;
}

export interface CategoryRepository {
  getCategory(id: number): Promise<Category | undefined>;
  getSubCategories(parentId: number): Promise<Category[] | undefined>;
  addCategory(category: Omit<Category, 'id'>): Promise<Category>;
  removeCategory(id: number): Promise<Category | undefined>;
  updateCategories(categories: Category[]): Promise<Category[] | undefined>;
}

export interface TeamRepository {
  getTeam(id: number): Promise<Team | undefined>;
}
