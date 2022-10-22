import { NotFoundException } from '@nestjs/common';

import {
  Category,
  CategoryRepository,
  Team,
  TeamRepository,
} from './interfaces';

function slugify(name: string): string {
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
    const slug = await this.generateSlug(name, parentCategory);
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

  private async fetchParentCategory(parent?: number) {
    if (!parent) return undefined;
    return this.find(parent);
  }

  private async generateSlug(
    name: string,
    parentCategory?: Category,
  ): Promise<string> {
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
