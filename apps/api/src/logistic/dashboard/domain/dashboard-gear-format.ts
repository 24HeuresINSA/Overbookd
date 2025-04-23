import { CSVBuilder } from "@overbookd/csv";
import { GearRequirementForCsv } from "../dashboard.service";
import { formatDateWithMinutes } from "@overbookd/time";

export class DashboardGearFormat {
  private constructor() {}

  static toCsv(requirements: GearRequirementForCsv[]): string {
    const data = requirements.map((requirement) => {
      const missingDetails =
        DashboardGearFormat.formatMissingDetailsForCsv(requirement);
      const stockDetails =
        DashboardGearFormat.formatStockDetailsForCsv(requirement);

      const date = formatDateWithMinutes(requirement.date);
      return { ...requirement, date, missingDetails, stockDetails };
    });

    return CSVBuilder.from(data)
      .select([
        "name",
        "missing",
        "missingDetails",
        "stock.total",
        "stockDetails",
        "date",
      ])
      .translate([
        ["name", "Matos"],
        ["missing", "Manque"],
        ["missingDetails", "Details Manque"],
        ["stock.total", "Stock"],
        ["stockDetails", "Details Stock"],
        ["date", "Date"],
      ])
      .delimitWith(";")
      .build();
  }

  private static formatMissingDetailsForCsv(
    requirement: GearRequirementForCsv,
  ): string {
    const { activities, tasks } = requirement.inquiries;
    const formattedActivities = activities.map(
      (a) => `FA ${a.id} - ${a.name} (${a.quantity})`,
    );
    const formattedTasks = tasks.map(
      (t) => `FT ${t.id} - ${t.name} (${t.quantity})`,
    );
    return [...formattedActivities, ...formattedTasks].join("\n");
  }

  private static formatStockDetailsForCsv(
    requirement: GearRequirementForCsv,
  ): string {
    const { inventory, borrows, purchases } = requirement.stock;
    const formattedBorrows = borrows.map((b) => `${b.lender} - ${b.quantity}`);
    const formattedPurchases = purchases.map(
      (p) => `${p.seller} - ${p.quantity}`,
    );
    const formattedInventory =
      inventory > 0 ? [`Inventaire - ${inventory}`] : [];
    return [
      ...formattedInventory,
      ...formattedBorrows,
      ...formattedPurchases,
    ].join("\n");
  }
}
