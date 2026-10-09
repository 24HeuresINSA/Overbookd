import { SlugifyService } from "@overbookd/slugify";
import {
  CatalogGear,
  GearSearchBuilder,
  GearSearchOptions,
} from "@overbookd/logistic";

export function filterGears<T extends CatalogGear>(
  gears: T[],
  options: GearSearchOptions,
): T[] {
  const slug = SlugifyService.applyOnOptional(options.search);
  const category = SlugifyService.applyOnOptional(options.category);
  const owner = SlugifyService.applyOnOptional(options.owner);
  return gears.filter(
    (gear) =>
      new GearSearchBuilder(gear)
        .addSlugCondition(slug)
        .addCategoryCondition(category)
        .addOwnerCondition(owner)
        .addPonctualUsageCondition(options.ponctualUsage).match,
  );
}
