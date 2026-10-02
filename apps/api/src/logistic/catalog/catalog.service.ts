import { ForbiddenException, Injectable } from "@nestjs/common";
import { SlugifyService } from "@overbookd/slugify";
import {
  CategoryRepository,
  GearRepository,
  CatalogCategory,
  CatalogGear,
  CatalogGearForm,
  GearSearchOptions,
  CategoryNotFoundException,
  GearNotFoundException,
} from "@overbookd/logistic";

type GearUpdateForm = CatalogGearForm & {
  id: number;
};

@Injectable()
export class CatalogService {
  constructor(
    private readonly gear: GearRepository,
    private readonly category: CategoryRepository,
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
    return this.gear.addGear({
      name,
      category,
      owner,
      slug,
      isPonctualUsage,
      isConsumable,
    });
  }

  async find(id: number): Promise<CatalogGear | undefined> {
    return this.gear.getGear(id);
  }

  async update(gear: GearUpdateForm): Promise<CatalogGear> {
    const { category, slug } = await this.generateComputedProperties(
      gear.name,
      gear.category,
    );
    const updatedGear = await this.gear.updateGear({
      ...gear,
      slug,
      category,
    });
    if (!updatedGear) throw new GearNotFoundException(gear.id);
    return updatedGear;
  }

  async remove(id: number): Promise<void> {
    const linked = await this.gear.getLinkedItems(id);
    const hasLinkedItems =
      linked?.actitivities.length ||
      linked?.tasks.length ||
      linked?.borrows.length;

    if (hasLinkedItems) {
      const actitivities = linked.actitivities.map((id) => `FA ${id}`);
      const tasks = linked.tasks.map((id) => `FT ${id}`);
      const borrows = linked.borrows.map((id) => `Fiche Emprunt ${id}`);
      const allLinkedItems = [...actitivities, ...tasks, ...borrows];
      const errorMessage = `Impossible de supprimer le matériel, il est lié à : ${allLinkedItems.join(", ")}`;
      throw new ForbiddenException(errorMessage);
    }

    return this.gear.removeGear(id);
  }

  async search(searchOptions: GearSearchOptions): Promise<CatalogGear[]> {
    return this.gear.searchGear(searchOptions);
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
    const storedCategory = await this.category.getCategory(categoryId);

    const isCategorySpecifiedButNotFound = categoryId && !storedCategory;
    if (isCategorySpecifiedButNotFound) {
      throw new CategoryNotFoundException(categoryId);
    }

    return storedCategory;
  }
}
