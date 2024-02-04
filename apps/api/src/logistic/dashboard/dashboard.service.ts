import { Injectable } from "@nestjs/common";
import { GearDetails, GearPreview, GearSearchOptions } from "@overbookd/http";
import { Period } from "@overbookd/period";
import { SlugifyService } from "@overbookd/slugify";

export interface DashboardGears {
  getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]>;
  getDetails(slug: string, period: Period): Promise<GearDetails[]>;
}

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardGears: DashboardGears) {}

  async getSummaries({
    name,
    category,
    owner,
  }: GearSearchOptions): Promise<GearPreview[]> {
    const nameSlug = SlugifyService.applyOnOptional(name);
    const categorySlug = SlugifyService.applyOnOptional(category);
    const ownerSlug = SlugifyService.applyOnOptional(owner);
    return this.dashboardGears.getSummaries({
      name: nameSlug,
      category: categorySlug,
      owner: ownerSlug,
    });
  }

  async getDetails(
    slug: string,
    start: Date,
    end: Date,
  ): Promise<GearDetails[]> {
    const period = Period.init({ start: new Date(start), end: new Date(end) });
    return this.dashboardGears.getDetails(slug, period);
  }
}
