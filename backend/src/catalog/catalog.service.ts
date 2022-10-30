import { NotFoundException } from '@nestjs/common';
import { SlugifyService } from '../common/services/slugify.service';
import { CategoryNotFoundException } from './category.service';
import {
  CategoryRepository,
  Gear,
  GearRepository,
  SimplifiedCategory,
} from './interfaces';

type GearCreateForm = {
  name: string;
  category?: number;
};

type GearUpdateForm = GearCreateForm & {
  id: number;
};

export class GearNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Gear #${id} doesn't exist`);
  }
}

export class CatalogService {
  constructor(
    private readonly slugService: SlugifyService,
    private readonly categoryRepository: CategoryRepository,
    private readonly gearRepository: GearRepository,
  ) {}

  async add({ name, category: categoryId }: GearCreateForm): Promise<Gear> {
    const { category, slug } = await this.generateComputedProperties(
      name,
      categoryId,
    );
    return this.gearRepository.addGear({
      name,
      category,
      slug,
    });
  }

  async find(id: number): Promise<Gear> {
    const gear = await this.gearRepository.getGear(id);
    if (!gear) throw new GearNotFoundException(id);
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
  }: {
    name: string;
    category?: string;
  }): Promise<Gear[]> {
    const slug = this.slugService.slugify(name);
    const categorySlug = this.slugService.slugify(category);
    return this.gearRepository.searchGear({ slug, category: categorySlug });
  }

  private async generateComputedProperties(name: string, categoryId: number) {
    const slug = this.slugService.slugify(name);
    const category = await this.getCategory(categoryId);
    return { category, slug };
  }

  private async getCategory(
    categoryId?: number,
  ): Promise<SimplifiedCategory | undefined> {
    const storedCategory = await this.categoryRepository.getCategory(
      categoryId,
    );

    const isCategorySpecifiedButNotFound = categoryId && !storedCategory;
    if (isCategorySpecifiedButNotFound) {
      throw new CategoryNotFoundException(categoryId);
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
