import { SummaryGearDetails, SummaryGearPreview } from "@overbookd/http";
import { DatabaseGear } from "./summary-gear.model";
import { Period, QUARTER_IN_MS } from "@overbookd/period";

export class SummaryGear {
  private constructor() {}

  public static generatePreview(gear: DatabaseGear): SummaryGearPreview {
    const stockDiscrepancy = this.computeStockDiscrepancyOn(gear);
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
  ): SummaryGearDetails[] {
    const periods = period.splitWithIntervalInMs(QUARTER_IN_MS);
    return periods.map(({ start, end }) => {
      return {
        start,
        end,
        activities: this.findActivitiesByDate(gear, start),
        inventory: this.findInventoryQuantity(gear),
      };
    });
  }

  private static computeStockDiscrepancyOn(gear: DatabaseGear): number {
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
    gear: DatabaseGear,
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
    gear: DatabaseGear,
    date: Date,
  ) {
    const stock = this.findStockByDate(gear);
    const inquiry = this.findInquiryQuantityByDate(gear, date);
    return stock - inquiry;
  }

  private static findStockByDate(gear: DatabaseGear /*, date: Date*/): number {
    // Date will be used in for purchase & loan sheets
    return this.findInventoryQuantity(gear);
  }

  private static findInventoryQuantity(gear: DatabaseGear): number {
    return gear.inventoryRecords.reduce(
      (total, { quantity }) => total + quantity,
      0,
    );
  }

  private static findInquiryQuantityByDate(
    { inquiries }: DatabaseGear,
    date: Date,
  ): number {
    return inquiries.reduce((total, inquiry) => {
      const isIncluded = inquiry.fa.inquiryTimeWindows.some((period) =>
        Period.init(period).isIncluding(date),
      );

      return isIncluded ? total + inquiry.quantity : total;
    }, 0);
  }

  private static findActivitiesByDate(
    gear: DatabaseGear,
    start: Date,
  ): SummaryGearDetails["activities"] {
    return gear.inquiries.reduce((activities, inquiry) => {
      const isIncluded = inquiry.fa.inquiryTimeWindows.some((period) =>
        Period.init(period).isIncluding(start),
      );

      return isIncluded
        ? [
            ...activities,
            {
              id: inquiry.fa.id,
              name: inquiry.fa.name,
              quantity: inquiry.quantity,
            },
          ]
        : activities;
    }, []);
  }
}
