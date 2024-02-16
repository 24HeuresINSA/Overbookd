import { Injectable } from "@nestjs/common";
import { GearDetails, GearPreview, GearSearchOptions } from "@overbookd/http";
import { Period } from "@overbookd/period";

export interface DashboardGears {
  getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]>;
  getDetails(slug: string, period: Period): Promise<GearDetails[]>;
}

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardGears: DashboardGears) {}

  async getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]> {
    return this.dashboardGears.getSummaries(searchOptions);
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
