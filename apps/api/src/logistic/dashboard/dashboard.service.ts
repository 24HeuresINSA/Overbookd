import { Injectable } from "@nestjs/common";
import {
  GearBorrow,
  GearDetailsInquiry,
  GearPreview,
  GearPurchase,
  GearSearchOptions,
  GearWithDetails,
} from "@overbookd/http";
import { Period } from "@overbookd/time";
import { DashboardGearFormat } from "./domain/dashboard-gear-format";

export type GearRequirementForCsv = {
  name: string;
  missing: number;
  date: Date;
  stock: {
    inventory: number;
    borrows: GearBorrow[];
    purchases: GearPurchase[];
    total: number;
  };
  inquiries: {
    activities: GearDetailsInquiry[];
    tasks: GearDetailsInquiry[];
  };
};

export type DashboardGears = {
  getSummaries(searchOptions: GearSearchOptions): Promise<GearPreview[]>;
  getDetails(slug: string, period: Period): Promise<GearWithDetails>;
  getRequirementsForCsv(): Promise<GearRequirementForCsv[]>;
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

  async getRequirementsInCsv(): Promise<string> {
    const requirements = await this.dashboardGears.getRequirementsForCsv();
    return DashboardGearFormat.toCsv(requirements);
  }
}
