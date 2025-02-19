import { DatabaseDashboardGear } from "../repository/dashboard.model";
import { Period, Duration, QUARTER_IN_MS } from "@overbookd/time";
import { DashboardGearStock } from "./dashboard-gear-stock";
import { DashboardGearInquiry } from "./dashboard-gear-inquiry";

type StockDiscrepancy = {
  date?: Date;
  quantity: number;
};

export class DashboardGearStockDiscrepancy {
  private constructor() {}

  static computeMinStockDiscrepancyOn(
    gear: DatabaseDashboardGear,
  ): StockDiscrepancy {
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

    const discrepanciesFromTimeWindows = mergedTimeWindows.map((timeWindow) =>
      DashboardGearStockDiscrepancy.computeStockDiscrepancyByTimeWindowOn(
        gear,
        timeWindow,
      ),
    );

    const inventory = DashboardGearStock.findInventoryQuantity(gear);
    const discrepanciesFromInventory = { quantity: inventory };

    const discrepancies = [
      discrepanciesFromInventory,
      ...discrepanciesFromTimeWindows,
    ];
    return discrepancies.reduce(
      (min, discrepancy) =>
        discrepancy.quantity < min.quantity ? discrepancy : min,
      discrepancies[0],
    );
  }

  private static computeStockDiscrepancyByTimeWindowOn(
    gear: DatabaseDashboardGear,
    timeWindow: Period,
  ): StockDiscrepancy {
    const period = Period.init(timeWindow);
    const periods = period.splitWithInterval(Duration.ms(QUARTER_IN_MS));

    const discrepancies = periods.map(({ start }) =>
      DashboardGearStockDiscrepancy.computeStockDiscrepancyByDateOn(
        gear,
        start,
      ),
    );
    return discrepancies.reduce(
      (max, discrepancy) =>
        discrepancy.quantity < max.quantity ? discrepancy : max,
      discrepancies[0],
    );
  }

  private static computeStockDiscrepancyByDateOn(
    gear: DatabaseDashboardGear,
    date: Date,
  ): StockDiscrepancy {
    const stock = DashboardGearStock.findStockByDate(gear, date);
    const { inquiry } = gear.isConsumable
      ? DashboardGearInquiry.computeConsumableInquiries(gear, date)
      : DashboardGearInquiry.computeGearInquiries(gear, date);
    const consumed = gear.isConsumable
      ? DashboardGearInquiry.computeConsumedQuantityByDateOn(gear, date)
      : 0;

    const quantity = stock - (inquiry + consumed);
    return { quantity, date };
  }
}
