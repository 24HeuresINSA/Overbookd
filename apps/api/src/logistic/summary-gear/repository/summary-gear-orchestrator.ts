import { QUARTER_IN_MS, Period } from "@overbookd/period";
import { DatabaseGearPreview } from "./summary-gear.model";

export class SummaryGearOrchestrator {
  private constructor() {}

  public static computeStockDiscrepancyOn(gear: DatabaseGearPreview): number {
    const inquiryTimeWindows = gear.inquiries
      .flatMap((inquiry) => inquiry.fa.inquiryTimeWindows)
      .map((period) => Period.init(period));
    const mergedTimeWindows = Period.mergeContiguous(inquiryTimeWindows);

    const discrepancies = mergedTimeWindows.map((timeWindow) => {
      return this.computeStockDiscrepancyByTimeWindowOn(gear, timeWindow);
    });

    return discrepancies.length > 0 ? Math.min(...discrepancies) : 0;
  }

  private static computeStockDiscrepancyByTimeWindowOn(
    gear: DatabaseGearPreview,
    timeWindow: Period,
  ): number {
    const period = Period.init(timeWindow);
    const periods = period.splitWithIntervalInMs(QUARTER_IN_MS);

    const discrepancies = periods.map(({ start }) => {
      return this.computeStockDiscrepancyByDateOn(gear, start);
    });
    return Math.min(...discrepancies);
  }

  private static computeStockDiscrepancyByDateOn(
    gear: DatabaseGearPreview,
    date: Date,
  ) {
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
    return inquiries.reduce((total, inquiry) => {
      const timeWindows = inquiry.fa.inquiryTimeWindows.map((period) =>
        Period.init(period),
      );

      const isIncluded = timeWindows.some((timeWindow) =>
        timeWindow.isIncluding(date),
      );

      return isIncluded ? total + inquiry.quantity : total;
    }, 0);
  }
}
