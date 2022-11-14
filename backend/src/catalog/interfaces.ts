import { BadRequestException } from '@nestjs/common';

export interface Category {
  id: number;
  name: string;
  slug: string;
  owner?: Team;
  parent?: number;
}

export type SimplifiedCategory = Omit<Category, 'parent' | 'owner'>;

export interface Team {
  slug: string;
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
}

export interface SearchGear {
  slug?: string;
  category?: string;
  owner?: string;
}

export interface SearchCategory {
  name?: string;
  owner?: string;
}

export interface GearRepository {
  getGear(id: number): Promise<Gear | undefined>;
  addGear(gear: Omit<Gear, 'id'>): Promise<Gear | undefined>;
  updateGear(gear: Gear): Promise<Gear | undefined>;
  removeGear(id: number): Promise<void>;
  searchGear(searchedGear: SearchGear): Promise<Gear[]>;
}

export interface CategoryRepository {
  getCategory(id: number): Promise<Category | undefined>;
  getSubCategories(parentId: number): Promise<Category[] | undefined>;
  addCategory(category: Omit<Category, 'id'>): Promise<Category>;
  removeCategory(id: number): Promise<Category | undefined>;
  updateCategories(categories: Category[]): Promise<Category[] | undefined>;
  updateCategory(categories: Category): Promise<Category | undefined>;
  getCategoryTrees(): Promise<CategoryTree[] | undefined>;
  searchCategory(searchedCategory: SearchCategory): Promise<Category[]>;
}

export interface TeamRepository {
  getTeam(slug: string): Promise<Team | undefined>;
}

export class GearAlreadyExists extends BadRequestException {
  gear: Gear;
  constructor(gear: Gear) {
    super(`"${gear.name}" gear already exists`);
    this.gear = gear;
  }
}
