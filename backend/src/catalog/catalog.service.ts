import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SlugifyService } from '../common/services/slugify.service';
import { CategoryNotFoundException } from './category.service';
import {
  Category,
  CategoryRepository,
  Gear,
  GearRepository,
} from './interfaces';

export type GearForm = {
  name: string;
  category?: number;
};

type GearUpdateForm = GearForm & {
  id: number;
};

export class GearNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Gear #${id} doesn't exist`);
  }
}

@Injectable()
export class CatalogService {
  constructor(
    private readonly slugService: SlugifyService,
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: CategoryRepository,
    @Inject('GEAR_REPOSITORY')
    private readonly gearRepository: GearRepository,
  ) {}

  async add({ name, category: categoryId }: GearForm): Promise<Gear> {
    const { category, slug, owner } = await this.generateComputedProperties(
      name,
      categoryId,
    );
    return this.gearRepository.addGear({
      name,
      category,
      owner,
      slug,
    });
  }

  async find(id: number): Promise<Gear> {
    const gear = await this.gearRepository.getGear(id);
    return gear;
  }

  async update(gear: GearUpdateForm): Promise<Gear> {
    const { category, slug } = await this.generateComputedProperties(
      gear.name,
      gear.category,
    );
    const updatedGear = await this.gearRepository.updateGear({
      ...gear,
      slug,
      category,
    });
    if (!updatedGear) throw new GearNotFoundException(gear.id);
    return updatedGear;
  }

  async remove(id: number): Promise<void> {
    return this.gearRepository.removeGear(id);
  }

  async search({
    name,
    category,
    owner,
  }: {
    name?: string;
    category?: string;
    owner?: string;
  }): Promise<Gear[]> {
    const slug = this.slugService.slugify(name);
    const categorySlug = this.slugService.slugify(category);
    const ownerSlug = this.slugService.slugify(owner);
    return this.gearRepository.searchGear({
      slug,
      category: categorySlug,
      owner: ownerSlug,
    });
  }

  private async generateComputedProperties(name: string, categoryId: number) {
    const slug = this.slugService.slugify(name);
    const category = await this.getCategory(categoryId);
    const simplifiedCategory = category
      ? { name: category.name, path: category.path, id: category.id }
      : undefined;
    const owner = category?.owner;
    return { category: simplifiedCategory, slug, owner };
  }

  private async getCategory(
    categoryId?: number,
  ): Promise<Category | undefined> {
    const storedCategory = await this.categoryRepository.getCategory(
      categoryId,
    );

    const isCategorySpecifiedButNotFound = categoryId && !storedCategory;
    if (isCategorySpecifiedButNotFound) {
      throw new CategoryNotFoundException(categoryId);
    }

    return storedCategory;
  }
}
