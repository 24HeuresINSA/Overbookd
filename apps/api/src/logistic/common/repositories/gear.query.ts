import { GearSearchOptions } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";

export class GearQueryBuilder {
  static find({ name, category, owner, ponctualUsage }: GearSearchOptions) {
    const slug = SlugifyService.applyOnOptional(name);
    const categorySlug = SlugifyService.applyOnOptional(category);
    const ownerSlug = SlugifyService.applyOnOptional(owner);

    const slugCondition = slug ? { slug: { contains: slug } } : {};
    const categoryCondition = GearQueryBuilder.buildCategorySearchCondition(
      categorySlug,
      ownerSlug,
    );
    const ponctualUsageCondition =
      GearQueryBuilder.buildUsageCondition(ponctualUsage);

    return {
      ...slugCondition,
      ...categoryCondition,
      ...ponctualUsageCondition,
    };
  }

  private static buildUsageCondition(ponctualUsage: boolean) {
    return ponctualUsage !== undefined
      ? { isPonctualUsage: ponctualUsage }
      : {};
  }

  private static buildCategorySearchCondition(category: string, owner: string) {
    if (!owner && !category) return {};

    const baseCategoryNameCondition = category
      ? { path: { contains: category } }
      : {};
    const baseCategoryOwnerCondition = owner
      ? { owner: { code: { contains: owner } } }
      : {};

    return {
      category: {
        ...baseCategoryNameCondition,
        ...baseCategoryOwnerCondition,
      },
    };
  }
}
