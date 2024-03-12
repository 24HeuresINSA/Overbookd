import { Injectable } from "@nestjs/common";
import {
  GearPreview,
  GearSearchOptions,
  GearWithDetails,
} from "@overbookd/http";
import { Period } from "@overbookd/period";

export type DashboardGears = {
  getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]>;
  getDetails(slug: string, period: Period): Promise<GearWithDetails>;
};

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
  ): Promise<GearWithDetails> {
    const period = Period.init({ start: new Date(start), end: new Date(end) });
    return this.dashboardGears.getDetails(slug, period);
  }
}
