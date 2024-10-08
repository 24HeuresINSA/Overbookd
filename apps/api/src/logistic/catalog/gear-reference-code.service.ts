import { CatalogCategoryIdentifier } from "@overbookd/http";

export class GearReferenceCodeService {
  static computeGearCode(
    category: CatalogCategoryIdentifier,
    id: number,
  ): string {
    const pathCode = this.computeCategoryPathCode(category);
    const idCode = this.toThreeDigitFormat(id);
    return `${pathCode}_${idCode}`;
  }

  private static toThreeDigitFormat(id: number) {
    return ("000" + id).slice(-3);
  }

  private static computeCategoryPathCode(category: CatalogCategoryIdentifier) {
    return category.path
      .split("->")
      .map((categorySlug) => this.toTwoLettersUpperCase(categorySlug))
      .join("_");
  }

  private static toTwoLettersUpperCase(categorySlug: string): string {
    return categorySlug.toUpperCase().slice(0, 2);
  }
}
