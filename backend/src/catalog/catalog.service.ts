import { NotFoundException } from '@nestjs/common';
import { SlugifyService } from '../common/services/slugify.service';
import {
  CategoryRepository,
  Gear,
  GearRepository,
  SimplifiedCategory,
} from './interfaces';

export class CatalogService {
  constructor(
    private readonly slugService: SlugifyService,
    private readonly categoryRepository: CategoryRepository,
    private readonly gearRepository: GearRepository,
  ) {}

  async add({
    name,
    category: categoryId,
  }: {
    name: string;
    category?: number;
  }): Promise<Gear> {
    const slug = this.slugService.slugify(name);
    const category = await this.getCategory(categoryId);
    return this.gearRepository.addGear({
      name,
      category,
      slug,
    });
  }

  async find(id: number): Promise<Gear> {
    return this.gearRepository.getGear(id);
  }

  private async getCategory(
    categoryId?: number,
  ): Promise<SimplifiedCategory | undefined> {
    const storedCategory = await this.categoryRepository.getCategory(
      categoryId,
    );

    const isCategorySpecifiedButNotFound = categoryId && !storedCategory;
    if (isCategorySpecifiedButNotFound) {
      throw new NotFoundException(`Category #${categoryId} doesn't exist`);
    }

    return storedCategory
      ? {
          id: storedCategory.id,
          name: storedCategory.name,
          slug: storedCategory.slug,
        }
      : undefined;
  }
}
