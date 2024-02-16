import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CategoryNotFoundException } from "./category.service";
import {
  Category,
  CategoryRepository,
  Gear,
  GearRepository,
} from "./interfaces";
import { SlugifyService } from "@overbookd/slugify";

export type GearForm = {
  name: string;
  category?: number;
  isPonctualUsage: boolean;
  isConsumable: boolean;
};

type GearUpdateForm = GearForm & {
  id: number;
};

export class GearNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Gear #${id} doesn't exist`);
  }
}

type GearSearchRequest = {
  name?: string;
  category?: string;
  owner?: string;
  ponctualUsage?: boolean;
};

@Injectable()
export class CatalogService {
  constructor(
    @Inject("CATEGORY_REPOSITORY")
    private readonly categoryRepository: CategoryRepository,
    @Inject("GEAR_REPOSITORY")
    private readonly gearRepository: GearRepository,
  ) {}

  async add({
    name,
    category: categoryId,
    isPonctualUsage,
    isConsumable,
  }: GearForm): Promise<Gear> {
    const { category, slug, owner } = await this.generateComputedProperties(
      name,
      categoryId,
    );
    return this.gearRepository.addGear({
      name,
      category,
      owner,
      slug,
      isPonctualUsage,
      isConsumable,
    });
  }

  async find(id: number): Promise<Gear | undefined> {
    return this.gearRepository.getGear(id);
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

  async search(searchOptions: GearSearchRequest): Promise<Gear[]> {
    return this.gearRepository.searchGear(searchOptions);
  }

  private async generateComputedProperties(name: string, categoryId: number) {
    const slug = SlugifyService.apply(name);
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
    if (!categoryId) return undefined;
    const storedCategory =
      await this.categoryRepository.getCategory(categoryId);

    const isCategorySpecifiedButNotFound = categoryId && !storedCategory;
    if (isCategorySpecifiedButNotFound) {
      throw new CategoryNotFoundException(categoryId);
    }

    return storedCategory;
  }
}
