import { SlugifyService } from "@overbookd/slugify";
import {
  CatalogCategory,
  CatalogCategoryTree,
  CategoryForm,
  CategoryOwner,
  CategorySearchOptions,
} from "./category";
import { CategoryNotFound } from "../catalog.error";

type UpdateCategoryForm = CategoryForm & { id: number };

export type CatalogCategories = {
  getCategory(id: number): Promise<CatalogCategory | undefined>;
  getSubCategories(parentId: number): Promise<CatalogCategory[]>;
  addCategory(category: Omit<CatalogCategory, "id">): Promise<CatalogCategory>;
  removeCategory(id: number): Promise<CatalogCategory | undefined>;
  updateCategories(categories: CatalogCategory[]): Promise<CatalogCategory[]>;
  updateCategory(
    category: CatalogCategory,
  ): Promise<CatalogCategory | undefined>;
  getCategoryTrees(): Promise<CatalogCategoryTree[]>;
  searchCategory(
    searchedCategory: CategorySearchOptions,
  ): Promise<CatalogCategory[]>;
};

export type CatalogTeams = {
  getTeam(code: string): Promise<CategoryOwner | undefined>;
};

export class CatalogCategoryManager {
  constructor(
    private readonly categories: CatalogCategories,
    private readonly teams: CatalogTeams,
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
    return this.categories.addCategory({
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
    const updatedCategory = await this.categories.updateCategory({
      id,
      name,
      path,
      parent,
      owner: ownerTeam,
    });
    if (!updatedCategory) throw new CategoryNotFound(id);
    await this.updateSubCategories(updatedCategory);
    return updatedCategory;
  }

  private async updateSubCategories(
    updatedCategory: CatalogCategory,
  ): Promise<void> {
    const updates = await this.computeDescendantUpdates(updatedCategory);
    if (updates.length > 0) {
      await this.categories.updateCategories(updates);
    }
  }

  private async computeDescendantUpdates(
    parent: CatalogCategory,
  ): Promise<CatalogCategory[]> {
    const children = await this.categories.getSubCategories(parent.id);
    const updates: CatalogCategory[] = [];

    for (const child of children) {
      const updatedChild: CatalogCategory = {
        ...child,
        path: this.generatePath(child.name, parent),
        owner: parent.owner,
      };
      updates.push(updatedChild);

      const descendantUpdates =
        await this.computeDescendantUpdates(updatedChild);
      updates.push(...descendantUpdates);
    }
    return updates;
  }

  async find(id: number): Promise<CatalogCategory> {
    const category = await this.categories.getCategory(id);
    if (!category) throw new CategoryNotFound(id);
    return category;
  }

  async getAll(): Promise<CatalogCategoryTree[]> {
    return this.categories.getCategoryTrees();
  }

  async remove(id: number): Promise<void> {
    const categoryToDelete = await this.categories.getCategory(id);
    if (!categoryToDelete) return;

    const newParent = categoryToDelete.parent
      ? await this.categories.getCategory(categoryToDelete.parent)
      : undefined;
    const directChildren = await this.categories.getSubCategories(
      categoryToDelete.id,
    );

    const updates: CatalogCategory[] = [];
    for (const child of directChildren) {
      const updatedChild: CatalogCategory = {
        ...child,
        parent: newParent?.id,
        path: this.generatePath(child.name, newParent),
        owner: newParent?.owner ?? child.owner,
      };
      updates.push(updatedChild);

      const descendantUpdates =
        await this.computeDescendantUpdates(updatedChild);
      updates.push(...descendantUpdates);
    }
    if (updates.length > 0) {
      await this.categories.updateCategories(updates);
    }

    await this.categories.removeCategory(id);
  }

  search({ name, owner }: CategorySearchOptions): Promise<CatalogCategory[]> {
    const nameSlug = SlugifyService.applyOnOptional(name);
    const ownerSlug = SlugifyService.applyOnOptional(owner);
    return this.categories.searchCategory({
      name: nameSlug,
      owner: ownerSlug,
    });
  }

  private async fetchParentCategory(parent?: number) {
    if (!parent) return undefined;
    return this.find(parent);
  }

  private generatePath(name: string, parentCategory?: CatalogCategory): string {
    const slug = SlugifyService.apply(name);
    return parentCategory ? `${parentCategory.path}->${slug}` : slug;
  }

  private async findOwner(
    owner?: string,
    parentCategory?: CatalogCategory,
  ): Promise<CategoryOwner | undefined> {
    if (parentCategory) return parentCategory.owner;
    return owner ? this.teams.getTeam(owner) : undefined;
  }
}
