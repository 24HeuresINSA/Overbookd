import { CatalogGear } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";

export class GearSearchBuilder {
  private ownerCondition = true;
  private slugCondition = true;
  private categoryContion = true;
  private ponctualUsageContion = true;
  private gear: CatalogGear;

  constructor(gear: CatalogGear) {
    this.gear = gear;
  }

  addOwnerCondition(ownerSearch?: string) {
    this.ownerCondition = ownerSearch
      ? this.gear.owner?.code?.includes(ownerSearch)
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
    this.categoryContion = categorySearch
      ? this.gear.category?.path?.includes(categorySearch)
      : true;
    return this;
  }

  addPonctualUsageCondition(ponctualUsage?: boolean) {
    this.ponctualUsageContion = ponctualUsage
      ? this.gear.isPonctualUsage === ponctualUsage
      : true;
    return this;
  }

  get match(): boolean {
    return (
      this.ownerCondition &&
      this.slugCondition &&
      this.categoryContion &&
      this.ponctualUsageContion
    );
  }
}
