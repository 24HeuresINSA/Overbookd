import { NotFoundException } from '@nestjs/common';

import {
  Category,
  CategoryRepository,
  Team,
  TeamRepository,
} from './interfaces';

export function slugify(name: string): string {
  const SLUG_SEPARATOR = '-';
  const spaces = new RegExp(/[ ]+/gm);
  return name.replace(spaces, SLUG_SEPARATOR).toLowerCase();
}

export class CatalogService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  async create({
    name,
    owner,
    parent,
  }: {
    name: string;
    owner?: number;
    parent?: number;
  }): Promise<Category> {
    const parentCategory = await this.fetchParentCategory(parent);
    const slug = this.generateSlug(name, parentCategory);
    const ownerTeam = await this.findOwner(owner, parentCategory);
    return this.categoryRepository.addCategory({
      name,
      slug,
      parent,
      owner: ownerTeam,
    });
  }

  async find(id: number): Promise<Category> {
    const category = await this.categoryRepository.getCategory(id);
    if (!category)
      throw new NotFoundException(`Category #${id} doesn\'t exist`);
    return category;
  }

  async remove(id: number): Promise<void> {
    const deletedCategory = await this.categoryRepository.removeCategory(id);
    if (!deletedCategory) return;
    return await this.cascadingUpdateChildren(deletedCategory);
  }

  private async cascadingUpdateChildren(deletedCategory: Category) {
    const newParent = await this.categoryRepository.getCategory(
      deletedCategory.parent,
    );

    const subCategories = await this.linkSubCategoriesToNewParent(
      deletedCategory.id,
      newParent,
    );

    const toUpdateCategories = await this.slugComputeCascading(
      newParent,
      subCategories,
    );
    await this.categoryRepository.updateCategories(toUpdateCategories);
    return;
  }

  private async slugComputeCascading(
    currentCategory: Category,
    subCategories: Category[],
    toUpdateCategories: Category[] = [],
  ): Promise<Category[]> {
    if (!subCategories.length) return toUpdateCategories;

    const updatedSubCategories = subCategories.map((subCategory) => ({
      ...subCategory,
      slug: this.generateSlug(subCategory.name, currentCategory),
    }));

    toUpdateCategories.push(...updatedSubCategories);

    const toUpdateCategoriesListing = await Promise.all(
      updatedSubCategories.map(async (subCategory) =>
        this.slugComputeCascading(
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

  private generateSlug(name: string, parentCategory?: Category): string {
    return parentCategory
      ? `${parentCategory.slug}->${slugify(name)}`
      : slugify(name);
  }

  private async findOwner(
    owner?: number,
    parentCategory?: Category,
  ): Promise<Team | undefined> {
    if (parentCategory) {
      return parentCategory?.owner ?? this.findOwner(owner);
    }
    return this.teamRepository.getTeam(owner);
  }
}
