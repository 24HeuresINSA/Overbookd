import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  CategoryRepository,
  TeamRepository,
} from "./repositories/catalog-repositories";
import { SlugifyService } from "@overbookd/slugify";
import {
  CatalogCategory,
  CatalogCategoryTree,
  CategoryForm,
  CategoryOwner,
  CategorySearchOptions,
} from "@overbookd/http";

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Category #${id} doesn't exist`);
  }
}

type UpdateCategoryForm = CategoryForm & { id: number };

@Injectable()
export class CategoryService {
  constructor(
    @Inject("CATEGORY_REPOSITORY")
    private readonly categoryRepository: CategoryRepository,
    @Inject("TEAM_REPOSITORY")
    private readonly teamRepository: TeamRepository,
  ) {}

  async create({
    name,
    owner,
    parent,
  }: CategoryForm): Promise<CatalogCategory> {
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
  }: UpdateCategoryForm): Promise<CatalogCategory> {
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

  private async updateSubCategories(updatedCategory: CatalogCategory) {
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

  async find(id: number): Promise<CatalogCategory> {
    const category = await this.categoryRepository.getCategory(id);
    if (!category) throw new CategoryNotFoundException(id);
    return category;
  }

  async getAll(): Promise<CatalogCategoryTree[]> {
    return this.categoryRepository.getCategoryTrees();
  }

  async remove(id: number): Promise<void> {
    const toDeleteCategory = await this.categoryRepository.getCategory(id);
    if (!toDeleteCategory) return;
    await this.cascadingUpdateSubCategories(toDeleteCategory);
    await this.categoryRepository.removeCategory(id);
  }

  search({ name, owner }: CategorySearchOptions): Promise<CatalogCategory[]> {
    const nameSlug = SlugifyService.applyOnOptional(name);
    const ownerSlug = SlugifyService.applyOnOptional(owner);
    return this.categoryRepository.searchCategory({
      name: nameSlug,
      owner: ownerSlug,
    });
  }

  private async cascadingUpdateSubCategories(currentCategory: CatalogCategory) {
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
    currentCategory: CatalogCategory,
    subCategories: CatalogCategory[],
    toUpdateCategories: CatalogCategory[] = [],
  ): Promise<CatalogCategory[]> {
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

  private async linkSubCategoriesToNewParent(
    id: number,
    newParent: CatalogCategory,
  ) {
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

  private generatePath(name: string, parentCategory?: CatalogCategory): string {
    return parentCategory
      ? `${parentCategory.path}->${SlugifyService.apply(name)}`
      : SlugifyService.apply(name);
  }

  private async findOwner(
    owner?: string,
    parentCategory?: CatalogCategory,
  ): Promise<CategoryOwner | undefined> {
    if (parentCategory) {
      return parentCategory?.owner ?? this.findOwner(owner);
    }
    return this.teamRepository.getTeam(owner);
  }
}
