import { BadRequestException } from '@nestjs/common';

export interface Category {
  id: number;
  name: string;
  path: string;
  owner?: Team;
  parent?: number;
}

export type SimplifiedCategory = Omit<Category, 'parent' | 'owner'>;

export interface Team {
  code: string;
  name: string;
}

export interface CategoryTree extends Category {
  subCategories?: CategoryTree[];
}

export interface Gear {
  id: number;
  name: string;
  slug: string;
  category?: SimplifiedCategory;
  owner?: Team;
  code?: string;
  isPonctualUsage: boolean;
}

export interface SearchGear {
  slug?: string;
  category?: string;
  owner?: string;
  ponctualUsage?: boolean;
}

export interface SearchCategory {
  name?: string;
  owner?: string;
}

export interface GearRepository {
  getGear(id: number): Promise<Gear>;
  addGear(gear: Omit<Gear, 'id'>): Promise<Gear | undefined>;
  updateGear(gear: Omit<Gear, 'owner'>): Promise<Gear | undefined>;
  removeGear(id: number): Promise<void>;
  searchGear(searchedGear: SearchGear): Promise<Gear[]>;
}

export interface CategoryRepository {
  getCategory(id: number): Promise<Category | undefined>;
  getSubCategories(parentId: number): Promise<Category[] | undefined>;
  addCategory(category: Omit<Category, 'id'>): Promise<Category>;
  removeCategory(id: number): Promise<Category | undefined>;
  updateCategories(categories: Category[]): Promise<Category[] | undefined>;
  updateCategory(category: Category): Promise<Category | undefined>;
  getCategoryTrees(): Promise<CategoryTree[] | undefined>;
  searchCategory(searchedCategory: SearchCategory): Promise<Category[]>;
}

export interface TeamRepository {
  getTeam(code: string): Promise<Team | undefined>;
}

export class GearAlreadyExists extends BadRequestException {
  gear: Pick<Gear, 'name'>;
  constructor(gear: Pick<Gear, 'name'>) {
    super(`"${gear.name}" gear already exists`);
    this.gear = gear;
  }
}

export class CategoryAlreadyExists extends BadRequestException {
  category: Pick<Category, 'name'>;
  constructor(category: Pick<Category, 'name'>) {
    super(`"${category.name}" category already exists`);
    this.category = category;
  }
}
