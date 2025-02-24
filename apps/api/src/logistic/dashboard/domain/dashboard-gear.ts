import { GearDetails, GearPreview } from "@overbookd/http";
import { DatabaseDashboardGear } from "../repository/dashboard.model";
import {
  IProvidePeriod,
  Period,
  Duration,
  QUARTER_IN_MS,
  OverDate,
} from "@overbookd/time";
import { DashboardGearStock } from "./dashboard-gear-stock";
import { DashboardGearInquiry } from "./dashboard-gear-inquiry";
import { DashboardGearStockDiscrepancy } from "./dashboard-gear-stock-discrepancy";
import { GearRequirementForCsv } from "../dashboard.service";

export class DashboardGear {
  private constructor() {}

  public static generatePreview(gear: DatabaseDashboardGear): GearPreview {
    const stockDiscrepancy =
      DashboardGearStockDiscrepancy.computeMinStockDiscrepancyOn(gear);
    return {
      id: gear.id,
      name: gear.name,
      slug: gear.slug,
      isConsumable: gear.isConsumable,
      stockDiscrepancy: stockDiscrepancy.quantity,
    };
  }

  public static generateRequirementForCsv(
    gear: DatabaseDashboardGear,
  ): GearRequirementForCsv | null {
    if (gear.isConsumable) return null;
    const stockDiscrepancy =
      DashboardGearStockDiscrepancy.computeMinStockDiscrepancyOn(gear);

    const start = stockDiscrepancy.date;
    if (stockDiscrepancy.quantity >= 0 || !start) return null;
    const end = OverDate.from(start).plus(Duration.ms(QUARTER_IN_MS)).date;
    const details = DashboardGear.gearPeriodDetails(gear, { start, end });

    return {
      name: gear.name,
      missing: Math.abs(stockDiscrepancy.quantity),
      date: stockDiscrepancy.date,
      stock: {
        inventory: details.inventory,
        borrows: details.borrows,
        purchases: details.purchases,
        total: details.stock,
      },
      inquiries: {
        activities: details.activities,
        tasks: details.tasks,
      },
    };
  }

  public static generateDetails(
    gear: DatabaseDashboardGear,
    period: Period,
  ): GearDetails[] {
    const periods = period.splitWithInterval(Duration.ms(QUARTER_IN_MS));

    return periods.map((period) => {
      return DashboardGear.periodDetails(gear, period);
    });
  }

  private static periodDetails(
    gear: DatabaseDashboardGear,
    period: IProvidePeriod,
  ): GearDetails {
    if (!gear.isConsumable) {
      return DashboardGear.gearPeriodDetails(gear, period);
    }
    return DashboardGear.consumablePeriodDetails(gear, period);
  }

  private static consumablePeriodDetails(
    gear: DatabaseDashboardGear,
    { start, end }: IProvidePeriod,
  ): GearDetails {
    const { inquiry, activities, tasks } =
      DashboardGearInquiry.computeConsumableInquiries(gear, start);
    const { stock, inventory, consumed, borrows, purchases } =
      DashboardGearStock.computeConsumableStock(gear, start);

    return {
      start,
      end,
      inquiry,
      stock,
      activities,
      tasks,
      inventory,
      consumed,
      borrows,
      purchases,
    };
  }

  private static gearPeriodDetails(
    gear: DatabaseDashboardGear,
    { end, start }: IProvidePeriod,
  ): GearDetails {
    const { inquiry, tasks, activities } =
      DashboardGearInquiry.computeGearInquiries(gear, start);
    const { stock, inventory, borrows, purchases } =
      DashboardGearStock.computeGearStock(gear, start);
    return {
      start,
      end,
      inquiry,
      stock,
      tasks,
      activities,
      inventory,
      borrows,
      purchases,
    };
  }
}
