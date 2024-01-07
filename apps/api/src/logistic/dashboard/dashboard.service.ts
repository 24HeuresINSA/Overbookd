import { Injectable } from "@nestjs/common";
import { DashboardGearDetails, DashboardGearPreview } from "@overbookd/http";
import { Period } from "@overbookd/period";

export interface DashboardGears {
  getSummaries(): Promise<DashboardGearPreview[]>;
  getDetails(slug: string, period: Period): Promise<DashboardGearDetails[]>;
}

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardGears: DashboardGears) {}

  async getSummaries(): Promise<DashboardGearPreview[]> {
    return this.dashboardGears.getSummaries();
  }

  async getDetails(
    slug: string,
    start: Date,
    end: Date,
  ): Promise<DashboardGearDetails[]> {
    const period = Period.init({ start: new Date(start), end: new Date(end) });
    return this.dashboardGears.getDetails(slug, period);
  }
}
