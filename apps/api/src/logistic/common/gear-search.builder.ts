import { SlugifyService } from "@overbookd/slugify";
import {
  CatalogGear,
  GearReferenceCodeGenerator,
  GearSearchOptions,
} from "@overbookd/logistic";
import { convertGearToApiContract, DatabaseGear } from "./gear.query";

export class GearSearchBuilder {
  private ownerCondition = true;
  private slugCondition = true;
  private categoryCondition = true;
  private ponctualUsageCondition = true;

  constructor(private gear: CatalogGear) {}

  addOwnerCondition(ownerSearch?: string) {
    this.ownerCondition = ownerSearch
      ? (this.gear.owner?.code?.includes(ownerSearch) ?? false)
      : true;
    return this;
  }

  addSlugCondition(slugSearch?: string) {
    const slugifiedCode = SlugifyService.apply(this.gear.code ?? "");
    this.slugCondition = slugSearch
      ? this.gear.slug.includes(slugSearch) ||
        slugifiedCode.includes(slugSearch)
      : true;
    return this;
  }

  addCategoryCondition(categorySearch?: string) {
    this.categoryCondition = categorySearch
      ? (this.gear.category?.path?.includes(categorySearch) ?? false)
      : true;
    return this;
  }

  addPonctualUsageCondition(ponctualUsage?: boolean) {
    this.ponctualUsageCondition =
      ponctualUsage === undefined
        ? true
        : this.gear.isPonctualUsage === ponctualUsage;
    return this;
  }

  get match(): boolean {
    return (
      this.ownerCondition &&
      this.slugCondition &&
      this.categoryCondition &&
      this.ponctualUsageCondition
    );
  }
}

function toCatalogGear(gear: DatabaseGear): CatalogGear {
  const code = gear.category
    ? GearReferenceCodeGenerator.generate(gear.category, gear.id)
    : undefined;
  return { ...convertGearToApiContract(gear), code };
}

export function filterGears<T extends DatabaseGear>(
  gears: T[],
  options: GearSearchOptions,
): T[] {
  const slug = SlugifyService.applyOnOptional(options.search);
  const category = SlugifyService.applyOnOptional(options.category);
  const owner = SlugifyService.applyOnOptional(options.owner);
  return gears.filter(
    (gear) =>
      new GearSearchBuilder(toCatalogGear(gear))
        .addSlugCondition(slug)
        .addCategoryCondition(category)
        .addOwnerCondition(owner)
        .addPonctualUsageCondition(options.ponctualUsage).match,
  );
}
