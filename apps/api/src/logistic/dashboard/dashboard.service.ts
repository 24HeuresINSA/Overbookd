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
      const { name, date, missing, inquiries, stock } = requirement;
      const missingDetails = [
        ...inquiries.activities.map((a) => `FA ${formatInquiry(a)})`),
        ...inquiries.tasks.map((t) => `FT ${formatInquiry(t)})`),
      ].join("\n");
      const stockDetails = [
        `Inventaire - ${stock.inventory}`,
        ...stock.borrows.map((b) => `${b.lender} - ${b.quantity}`),
        ...stock.purchases.map((p) => `${p.seller} - ${p.quantity}`),
      ].join("\n");
      const formattedDate = formatDateWithMinutes(date);
      return `${name},${missing},"${missingDetails}",${stock.total},"${stockDetails}",${formattedDate}`;
    });

    return header + lines.join("\n");
  }
}

function formatInquiry(inquiry: GearDetailsInquiry): string {
  return `${inquiry.id} - ${inquiry.name} (${inquiry.quantity})`;
}
