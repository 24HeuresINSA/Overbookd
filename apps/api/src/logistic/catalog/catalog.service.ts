import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CategoryNotFoundException } from "./category.service";
import {
  CategoryRepository,
  GearRepository,
} from "./repositories/catalog-repositories";
import { SlugifyService } from "@overbookd/slugify";
import {
  CatalogCategory,
  CatalogGear,
  CatalogGearForm,
  GearSearchOptions,
} from "@overbookd/http";

type GearUpdateForm = CatalogGearForm & {
  id: number;
};

export type GearLinkedItems = {
  tasks: number[];
  actitivities: number[];
  borrows: number[];
  purchases: number[];
};

export class GearNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Gear #${id} doesn't exist`);
  }
}

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
  }: CatalogGearForm): Promise<CatalogGear> {
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

  async find(id: number): Promise<CatalogGear | undefined> {
    return this.gearRepository.getGear(id);
  }

  async update(gear: GearUpdateForm): Promise<CatalogGear> {
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
    const linked = await this.gearRepository.getLinkedItems(id);
    const hasLinkedItems =
      linked?.actitivities.length ||
      linked?.tasks.length ||
      linked?.borrows.length ||
      linked?.purchases.length;

    if (hasLinkedItems) {
      const actitivities = linked.actitivities.map((id) => `FA ${id}`);
      const tasks = linked.tasks.map((id) => `FT ${id}`);
      const borrows = linked.borrows.map((id) => `Fiche Emprunt ${id}`);
      const purchases = linked.purchases.map((id) => `Fiche Achat ${id}`);
      const allLinkedItems = [
        ...actitivities,
        ...tasks,
        ...borrows,
        ...purchases,
      ];
      const errorMessage = `Impossible de supprimer le matériel, il est lié à : ${allLinkedItems.join(", ")}`;
      throw new Error(errorMessage);
    }

    return this.gearRepository.removeGear(id);
  }

  async search(searchOptions: GearSearchOptions): Promise<CatalogGear[]> {
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
  ): Promise<CatalogCategory | undefined> {
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
