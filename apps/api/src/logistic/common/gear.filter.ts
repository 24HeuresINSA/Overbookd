import { GearSearchOptions } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import { GearReferenceCodeService } from "../catalog/gear-reference-code.service";
import { DatabaseGear } from "./dto/gear.query";

export class GearFilter {
  static apply<T extends DatabaseGear>(
    gears: T[],
    options: GearSearchOptions,
  ): T[] {
    const { search, category, owner, ponctualUsage } = options;
    const slug = SlugifyService.applyOnOptional(search);
    const categorySlug = SlugifyService.applyOnOptional(category);
    const ownerSlug = SlugifyService.applyOnOptional(owner);

    return gears.filter((gear) => {
      return (
        (this.matchReference(gear, slug) || this.matchName(gear, slug)) &&
        this.matchCategory(gear, categorySlug) &&
        this.matchOwner(gear, ownerSlug) &&
        this.matchUsage(gear, ponctualUsage)
      );
    });
  }

  private static matchReference(gear: DatabaseGear, slug: string): boolean {
    if (!slug) return true;
    const code = GearReferenceCodeService.computeGearCode(
      gear.category,
      gear.id,
    );
    const slugifiedCode = SlugifyService.apply(code);
    return slugifiedCode.includes(slug);
  }

  private static matchName(gear: DatabaseGear, slug: string): boolean {
    return slug ? gear.slug.includes(slug) : true;
  }

  private static matchCategory(gear: DatabaseGear, category?: string): boolean {
    return category === undefined || gear.category.path.includes(category);
  }

  private static matchOwner(gear: DatabaseGear, owner?: string): boolean {
    return owner === undefined || gear.category.owner.code === owner;
  }

  private static matchUsage(
    gear: DatabaseGear,
    ponctualUsage?: boolean,
  ): boolean {
    return (
      ponctualUsage === undefined || gear.isPonctualUsage === ponctualUsage
    );
  }
}
