import { SimplifiedCategory } from './interfaces';

export class GearReferenceCodeService {
  static computeGearCode(category: SimplifiedCategory, id: number): string {
    const pathCode = this.computeCategoryPathCode(category);
    const idCode = this.toThreeDigitFormat(id);
    return `${pathCode}_${idCode}`;
  }

  private static toThreeDigitFormat(id: number) {
    return ('000' + id).slice(-3);
  }

  private static computeCategoryPathCode(category: SimplifiedCategory) {
    return category.path
      .split('->')
      .map((categorySlug) => this.toTwoLettersUpperCase(categorySlug))
      .join('_');
  }

  private static toTwoLettersUpperCase(categorySlug: string): string {
    return categorySlug.toUpperCase().slice(0, 2);
  }
}
