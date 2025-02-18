import { Injectable } from "@nestjs/common";
import {
  GearBorrow,
  GearDetailsInquiry,
  GearPreview,
  GearPurchase,
  GearSearchOptions,
  GearWithDetails,
} from "@overbookd/http";
import { formatDateWithMinutes, Period } from "@overbookd/time";

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
  getRequirementsForCsv(
    searchOptions: GearSearchOptions,
  ): Promise<GearRequirementForCsv[]>;
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

  async getRequirementsInCsv(
    searchOptions: GearSearchOptions,
  ): Promise<string> {
    const requirements =
      await this.dashboardGears.getRequirementsForCsv(searchOptions);
    return this.toCsv(requirements);
  }

  private toCsv(requirements: GearRequirementForCsv[]): string {
    const header = "Matos,Manque,Details Manque,Stock,Details Stock,Date\n";

    const lines = requirements.map((requirement) => {
      const missingDetails = [
        ...requirement.inquiries.activities.map(
          (a) => `FA ${a.id} - ${a.name} (${a.quantity})`,
        ),
        ...requirement.inquiries.tasks.map(
          (t) => `FT ${t.id} - ${t.name} (${t.quantity})`,
        ),
      ].join("\n");

      const stockDetails = [
        `Inventaire - ${requirement.stock.inventory}`,
        ...requirement.stock.borrows.map((b) => `${b.lender} - ${b.quantity}`),
      ].join("\n");

      const date = formatDateWithMinutes(requirement.date);

      return `${requirement.name},${requirement.missing},"${missingDetails}",${requirement.stock.total},"${stockDetails}",${date}`;
    });

    return header + lines.join("\n");
  }
}
