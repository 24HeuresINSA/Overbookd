import { GearSearchOptions } from "@overbookd/http";

export class GearQueryBuilder {
  static find({ name, category, owner, ponctualUsage }: GearSearchOptions) {
    const slugCondition = name ? { slug: { contains: name } } : {};
    const categoryCondition = GearQueryBuilder.buildCategorySearchCondition(
      category,
      owner,
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
