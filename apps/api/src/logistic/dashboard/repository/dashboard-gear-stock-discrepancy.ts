import { DatabaseDashboardGear } from "./dashboard.model";
import { Period, Duration, QUARTER_IN_MS } from "@overbookd/time";
import { DashboardGearStock } from "./dashboard-gear-stock";
import { DashboardGearInquiry } from "./dashboard-gear-inquiry";

export class DashboardGearStockDiscrepancy {
  private constructor() {}

  static computeMinStockDiscrepancyOn(gear: DatabaseDashboardGear): number {
    const activityTimeWindows = gear.festivalActivityInquiries
      .flatMap((inquiry) => inquiry.fa.inquiryTimeWindows)
      .map((period) => Period.init(period));

    const taskTimeWindows = gear.festivalTaskInquiries
      .flatMap((inquiry) => inquiry.ft.mobilizations)
      .map((period) => Period.init(period));

    const borrowTimeWindows = gear.borrows.map(({ borrow }) => {
      const { availableOn: start, unavailableOn: end } = borrow;
      return Period.init({ start, end });
    });

    const timeWindows = [
      ...activityTimeWindows,
      ...taskTimeWindows,
      ...borrowTimeWindows,
    ];
    const mergedTimeWindows = Period.mergeContiguous(timeWindows);

    const discrepanciesFromTimeWindows = mergedTimeWindows.map((timeWindow) => {
      return DashboardGearStockDiscrepancy.computeStockDiscrepancyByTimeWindowOn(
        gear,
        timeWindow,
      );
    });

    const inventory = DashboardGearStock.findInventoryQuantity(gear);
    return Math.min(...discrepanciesFromTimeWindows, inventory);
  }

  private static computeStockDiscrepancyByTimeWindowOn(
    gear: DatabaseDashboardGear,
    timeWindow: Period,
  ): number {
    const period = Period.init(timeWindow);
    const periods = period.splitWithInterval(Duration.ms(QUARTER_IN_MS));

    const discrepancies = periods.map(({ start }) =>
      DashboardGearStockDiscrepancy.computeStockDiscrepancyByDateOn(
        gear,
        start,
      ),
    );
    return Math.min(...discrepancies);
  }

  private static computeStockDiscrepancyByDateOn(
    gear: DatabaseDashboardGear,
    date: Date,
  ) {
    const stock = DashboardGearStock.findStockByDate(gear, date);
    const { inquiry } = gear.isConsumable
      ? DashboardGearInquiry.computeConsumableInquiries(gear, date)
      : DashboardGearInquiry.computeGearInquiries(gear, date);
    const consumed = gear.isConsumable
      ? DashboardGearInquiry.computeConsumedQuantityByDateOn(gear, date)
      : 0;
    return stock - (inquiry + consumed);
  }
}
