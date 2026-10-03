import { SlugifyService } from "@overbookd/slugify";
import { CatalogGear } from "@overbookd/logistic";

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
    this.ponctualUsageCondition = ponctualUsage
      ? this.gear.isPonctualUsage === ponctualUsage
      : true;
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
