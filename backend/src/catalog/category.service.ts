import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SlugifyService } from '../common/services/slugify.service';

import {
  Category,
  CategoryRepository,
  CategoryTree,
  SearchCategory,
  Team,
  TeamRepository,
} from './interfaces';

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Category #${id} doesn\'t exist`);
  }
}

export type CategoryForm = {
  name: string;
  owner?: string;
  parent?: number;
};

type updateCategoryForm = CategoryForm & { id: number };

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: CategoryRepository,
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: TeamRepository,
    private readonly slugifyService: SlugifyService,
  ) {}

  async create({ name, owner, parent }: CategoryForm): Promise<Category> {
    const { path, ownerTeam } = await this.buildOwnerAndPath({
      parent,
      name,
      owner,
    });
    return this.categoryRepository.addCategory({
      name,
      path,
      parent,
      owner: ownerTeam,
    });
  }

  private async buildOwnerAndPath({ parent, name, owner }: CategoryForm) {
    const parentCategory = await this.fetchParentCategory(parent);
    const path = this.generatePath(name, parentCategory);
    const ownerTeam = await this.findOwner(owner, parentCategory);
    return { path, ownerTeam };
  }

  async update({
    name,
    parent,
    owner,
    id,
  }: updateCategoryForm): Promise<Category> {
    const { path, ownerTeam } = await this.buildOwnerAndPath({
      parent,
      name,
      owner,
    });
    const updatedCategory = await this.categoryRepository.updateCategory({
      id,
      name,
      path,
      parent,
      owner: ownerTeam,
    });
    if (!updatedCategory) throw new CategoryNotFoundException(id);
    await this.updateSubCategories(updatedCategory);
    return updatedCategory;
  }

  private async updateSubCategories(updatedCategory: Category) {
    const subCategories = await this.categoryRepository.getSubCategories(
      updatedCategory.id,
    );
    const categoriesWithNewPath = await this.pathComputeCascading(
      updatedCategory,
      subCategories,
    );
    const categoriesWithNewOwner = categoriesWithNewPath.map((category) => {
      const owner = updatedCategory.owner ?? category.owner;
      return { ...category, owner };
    });

    await this.categoryRepository.updateCategories(categoriesWithNewOwner);
  }

  async find(id: number): Promise<Category> {
    const category = await this.categoryRepository.getCategory(id);
    if (!category) throw new CategoryNotFoundException(id);
    return category;
  }

  async getAll(): Promise<CategoryTree[]> {
    return this.categoryRepository.getCategoryTrees();
  }

  async remove(id: number): Promise<void> {
    const toDeleteCategory = await this.categoryRepository.getCategory(id);
    if (!toDeleteCategory) return;
    await this.cascadingUpdateSubCategories(toDeleteCategory);
    await this.categoryRepository.removeCategory(id);
  }

  search({ name, owner }: SearchCategory): Promise<Category[]> {
    const nameSlug = this.slugifyService.slugify(name);
    const ownerSlug = this.slugifyService.slugify(owner);
    return this.categoryRepository.searchCategory({
      name: nameSlug,
      owner: ownerSlug,
    });
  }

  private async cascadingUpdateSubCategories(currentCategory: Category) {
    const newParent = currentCategory.parent
      ? await this.categoryRepository.getCategory(currentCategory.parent)
      : undefined;

    const subCategories = await this.linkSubCategoriesToNewParent(
      currentCategory.id,
      newParent,
    );

    const toUpdateCategories = await this.pathComputeCascading(
      newParent,
      subCategories,
    );
    await this.categoryRepository.updateCategories(toUpdateCategories);
    return;
  }

  private async pathComputeCascading(
    currentCategory: Category,
    subCategories: Category[],
    toUpdateCategories: Category[] = [],
  ): Promise<Category[]> {
    if (!subCategories.length) return toUpdateCategories;

    const updatedSubCategories = subCategories.map((subCategory) => ({
      ...subCategory,
      path: this.generatePath(subCategory.name, currentCategory),
    }));

    toUpdateCategories.push(...updatedSubCategories);

    const toUpdateCategoriesListing = await Promise.all(
      updatedSubCategories.map(async (subCategory) =>
        this.pathComputeCascading(
          subCategory,
          await this.categoryRepository.getSubCategories(subCategory.id),
          toUpdateCategories,
        ),
      ),
    );
    return toUpdateCategoriesListing.flat();
  }

  private async linkSubCategoriesToNewParent(id: number, newParent: Category) {
    const categories = await this.categoryRepository.getSubCategories(id);

    const updatedSubCategories = categories.map((subCategory) => ({
      ...subCategory,
      parent: newParent?.id,
    }));
    return this.categoryRepository.updateCategories(updatedSubCategories);
  }

  private async fetchParentCategory(parent?: number) {
    if (!parent) return undefined;
    return this.find(parent);
  }

  private generatePath(name: string, parentCategory?: Category): string {
    return parentCategory
      ? `${parentCategory.path}->${this.slugifyService.slugify(name)}`
      : this.slugifyService.slugify(name);
  }

  private async findOwner(
    owner?: string,
    parentCategory?: Category,
  ): Promise<Team | undefined> {
    if (parentCategory) {
      return parentCategory?.owner ?? this.findOwner(owner);
    }
    return this.teamRepository.getTeam(owner);
  }
}
