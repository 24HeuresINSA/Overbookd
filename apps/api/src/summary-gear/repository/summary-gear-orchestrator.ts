import { ONE_MINUTE_IN_MS, Period } from "@overbookd/period";
import { DatabaseGearPreview } from "./summary-gear.model";

export class SummaryGearOrchestrator {
  private constructor() {}

  public static calculeMinDelta(gear: DatabaseGearPreview): number {
    const inquiryTimeWindows = gear.inquiries
      .flatMap((inquiry) => inquiry.fa.inquiryTimeWindows)
      .map(Period.init);
    const mergedTimeWindows = Period.mergeWithAdjacents(inquiryTimeWindows);

    const deltas = mergedTimeWindows.map((timeWindow) => {
      return this.calculeMinDeltaByTimeWindow(gear, timeWindow);
    });

    return Math.min(...deltas);
  }

  private static calculeMinDeltaByTimeWindow(
    gear: DatabaseGearPreview,
    timeWindow: Period,
  ): number {
    const period = Period.init(timeWindow);
    const periods = period.splitWithIntervalInMs(15 * ONE_MINUTE_IN_MS);

    const deltas = periods.map(({ start }) => {
      return this.calculeDeltaByDate(gear, start);
    });
    return Math.min(...deltas);
  }

  private static calculeDeltaByDate(gear: DatabaseGearPreview, date: Date) {
    const stock = this.findStockByDate(gear, date);
    const inquiry = this.findInquiryQuantityByDate(gear, date);
    return stock - inquiry;
  }

  private static findStockByDate(
    gear: DatabaseGearPreview,
    date: Date,
  ): number {
    console.log(date);
    // Date will be used in for purchase & loan sheets
    return gear.inventoryRecords
      .map(({ quantity }) => quantity)
      .reduce((total, quantity) => total + quantity, 0);
  }

  private static findInquiryQuantityByDate(
    { inquiries }: DatabaseGearPreview,
    date: Date,
  ): number {
    return inquiries
      .filter((inquiry) => {
        const timeWindows = inquiry.fa.inquiryTimeWindows.map(Period.init);
        return timeWindows.some((timeWindow) =>
          timeWindow.isIncludedByDate(date),
        );
      })
      .map((inquiry) => inquiry.quantity)
      .reduce((total, quantity) => total + quantity, 0);
  }
}
