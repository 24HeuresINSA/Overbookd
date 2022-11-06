import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SlugifyService } from '../common/services/slugify.service';

import {
  Category,
  CategoryRepository,
  CategoryTree,
  Team,
  TeamRepository,
} from './interfaces';

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Category #${id} doesn\'t exist`);
  }
}

type CreateCategoryForm = {
  name: string;
  owner?: string;
  parent?: number;
};

type updateCategoryForm = CreateCategoryForm & { id: number };

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: CategoryRepository,
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: TeamRepository,
    private readonly slugifyService: SlugifyService,
  ) {}

  async create({ name, owner, parent }: CreateCategoryForm): Promise<Category> {
    const { slug, ownerTeam } = await this.buildOwnerAndSlug({
      parent,
      name,
      owner,
    });
    return this.categoryRepository.addCategory({
      name,
      slug,
      parent,
      owner: ownerTeam,
    });
  }

  private async buildOwnerAndSlug({ parent, name, owner }: CreateCategoryForm) {
    const parentCategory = await this.fetchParentCategory(parent);
    const slug = this.generateSlug(name, parentCategory);
    const ownerTeam = await this.findOwner(owner, parentCategory);
    return { slug, ownerTeam };
  }

  async update({
    name,
    parent,
    owner,
    id,
  }: updateCategoryForm): Promise<Category> {
    const { slug, ownerTeam } = await this.buildOwnerAndSlug({
      parent,
      name,
      owner,
    });
    const updatedCategory = await this.categoryRepository.updateCategory({
      id,
      name,
      slug,
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
    const categoriesWithNewSlug = await this.slugComputeCascading(
      updatedCategory,
      subCategories,
    );
    const categoriesWithNewOwner = categoriesWithNewSlug.map((category) => {
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
    const deletedCategory = await this.categoryRepository.removeCategory(id);
    if (!deletedCategory) return;
    return await this.cascadingUpdateSubCategories(deletedCategory);
  }

  private async cascadingUpdateSubCategories(currentCategory: Category) {
    const newParent = await this.categoryRepository.getCategory(
      currentCategory.parent,
    );

    const subCategories = await this.linkSubCategoriesToNewParent(
      currentCategory.id,
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
      ? `${parentCategory.slug}->${this.slugifyService.slugify(name)}`
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
