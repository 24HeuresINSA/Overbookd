import { SlugifyService } from "@overbookd/slugify";
import {
  CatalogGear,
  GearReferenceCodeGenerator,
  GearSearchBuilder,
  GearSearchOptions,
} from "@overbookd/logistic";
import { convertGearToApiContract, DatabaseGear } from "./gear.query";

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
