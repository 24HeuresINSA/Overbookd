import { GearRequirementForCsv } from "../dashboard.service";
import { formatDateWithMinutes } from "@overbookd/time";

export class DashboardGearFormat {
  private constructor() {}

  static toCsv(requirements: GearRequirementForCsv[]): string {
    const header = "Matos,Manque,Details Manque,Stock,Details Stock,Date\n";

    const lines = requirements.map((requirement) => {
      const missingDetails =
        DashboardGearFormat.formatMissingDetailsForCsv(requirement);
      const stockDetails =
        DashboardGearFormat.formatStockDetailsForCsv(requirement);

      const { name, date, missing, stock } = requirement;
      const formattedDate = formatDateWithMinutes(date);
      return `${name},${missing},"${missingDetails}",${stock.total},"${stockDetails}",${formattedDate}`;
    });

    return header + lines.join("\n");
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
