import { ONE_MINUTE_IN_MS, Period } from "@overbookd/period";
import { DatabaseGearPreview } from "./summary-gear.model";

export class SummaryGearOrchestrator {
  private constructor() {}

  public static computeStockDiscrepancyOn(gear: DatabaseGearPreview): number {
    const inquiryTimeWindows = gear.inquiries
      .flatMap((inquiry) => inquiry.fa.inquiryTimeWindows)
      .map(Period.init);
    const mergedTimeWindows = Period.mergeContiguous(inquiryTimeWindows);

    const discrepancies = mergedTimeWindows.map((timeWindow) => {
      return this.computeStockDiscrepancyByTimeWindowOn(gear, timeWindow);
    });

    return Math.min(...discrepancies);
  }

  private static computeStockDiscrepancyByTimeWindowOn(
    gear: DatabaseGearPreview,
    timeWindow: Period,
  ): number {
    const period = Period.init(timeWindow);
    const periods = period.splitWithIntervalInMs(15 * ONE_MINUTE_IN_MS);

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
    return inquiries
      .filter((inquiry) => {
        const timeWindows = inquiry.fa.inquiryTimeWindows.map(Period.init);
        return timeWindows.some((timeWindow) => timeWindow.isIncluding(date));
      })
      .map((inquiry) => inquiry.quantity)
      .reduce((total, quantity) => total + quantity, 0);
  }
}
