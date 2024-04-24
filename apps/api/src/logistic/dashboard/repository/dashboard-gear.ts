import { GearDetails, GearPreview } from "@overbookd/http";
import { DatabaseGear } from "./dashboard.model";
import { IProvidePeriod, Period, QUARTER_IN_MS } from "@overbookd/period";
import { DashboardGearStock } from "./dashboard-gear-stock";
import { DashboardGearInquiry } from "./dashboard-gear-inquiry";
import { DashboardGearStockDiscrepancy } from "./dashboard-gear-stock-discrepancy";

export class DashboardGear {
  private constructor() {}

  public static generatePreview(gear: DatabaseGear): GearPreview {
    const stockDiscrepancy =
      DashboardGearStockDiscrepancy.computeMinStockDiscrepancyOn(gear);
    return {
      id: gear.id,
      name: gear.name,
      slug: gear.slug,
      isConsumable: gear.isConsumable,
      stockDiscrepancy,
    };
  }

  public static generateDetails(
    gear: DatabaseGear,
    period: Period,
  ): GearDetails[] {
    const periods = period.splitWithIntervalInMs(QUARTER_IN_MS);

    return periods.map((period) => {
      return DashboardGear.periodDetails(gear, period);
    });
  }

  private static periodDetails(gear: DatabaseGear, period: IProvidePeriod) {
    if (!gear.isConsumable) {
      return DashboardGear.gearPeriodDetails(gear, period);
    }
    return DashboardGear.consumablePeriodDetails(gear, period);
  }

  private static consumablePeriodDetails(
    gear: DatabaseGear,
    { start, end }: IProvidePeriod,
  ) {
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
    gear: DatabaseGear,
    { end, start }: IProvidePeriod,
  ) {
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
