import { GearDetails, GearPreview } from "@overbookd/http";
import {
  DatabaseActivityInquiry,
  DatabaseGear,
  DatabaseTaskInquiry,
} from "./dashboard.model";
import { Period, QUARTER_IN_MS } from "@overbookd/period";

export class DashboardGear {
  private constructor() {}

  public static generatePreview(gear: DatabaseGear): GearPreview {
    const stockDiscrepancy = DashboardGear.computeStockDiscrepancyOn(gear);
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

    return periods.map(({ start, end }) => {
      const stock = DashboardGear.findStockByDate(gear);
      const inquiry = DashboardGear.findInquiryQuantityByDate(gear, start);
      const activities = DashboardGear.findActivitiesByDate(gear, start);
      const tasks = DashboardGear.findTasksByDate(gear, start);
      const inventory = DashboardGear.findInventoryQuantity(gear);

      return {
        start,
        end,
        inquiry,
        stock,
        activities,
        tasks,
        inventory,
      };
    });
  }

  private static computeStockDiscrepancyOn(gear: DatabaseGear): number {
    const inquiryTimeWindows = gear.festivalActivityInquiries
      .flatMap((inquiry) => inquiry.fa.inquiryTimeWindows)
      .map((period) => Period.init(period));
    const mergedTimeWindows = Period.mergeContiguous(inquiryTimeWindows);

    const discrepancies = mergedTimeWindows.map((timeWindow) => {
      return DashboardGear.computeStockDiscrepancyByTimeWindowOn(
        gear,
        timeWindow,
      );
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
      return DashboardGear.computeStockDiscrepancyByDateOn(gear, start);
    });
    return Math.min(...discrepancies);
  }

  private static computeStockDiscrepancyByDateOn(
    gear: DatabaseGear,
    date: Date,
  ) {
    const stock = DashboardGear.findStockByDate(gear);
    const inquiry = DashboardGear.findInquiryQuantityByDate(gear, date);
    return stock - inquiry;
  }

  private static findStockByDate(gear: DatabaseGear /*, date: Date*/): number {
    // Date will be used in for purchase & loan sheets
    return DashboardGear.findInventoryQuantity(gear);
  }

  private static findInventoryQuantity(gear: DatabaseGear): number {
    return gear.inventoryRecords.reduce(
      (total, { quantity }) => total + quantity,
      0,
    );
  }

  private static findInquiryQuantityByDate(
    { festivalActivityInquiries, festivalTaskInquiries }: DatabaseGear,
    date: Date,
  ): number {
    const activityQuantity = DashboardGear.findActivityInquiryQuantityByDate(
      festivalActivityInquiries,
      date,
    );
    const taskQuantity = DashboardGear.findTaskInquiryQuantityByDate(
      festivalTaskInquiries,
      date,
    );
    return activityQuantity + taskQuantity;
  }

  private static findActivityInquiryQuantityByDate(
    inquiries: DatabaseActivityInquiry[],
    date: Date,
  ): number {
    return inquiries.reduce((total, inquiry) => {
      const isIncluded = inquiry.fa.inquiryTimeWindows.some((period) =>
        Period.init(period).isIncluding(date),
      );

      return isIncluded ? total + inquiry.quantity : total;
    }, 0);
  }

  private static findTaskInquiryQuantityByDate(
    inquiries: DatabaseTaskInquiry[],
    date: Date,
  ): number {
    return inquiries.reduce((total, inquiry) => {
      const isIncluded = inquiry.ft.mobilizations.some((period) =>
        Period.init(period).isIncluding(date),
      );

      return isIncluded ? total + inquiry.quantity : total;
    }, 0);
  }

  private static findActivitiesByDate(
    { festivalActivityInquiries }: DatabaseGear,
    start: Date,
  ): GearDetails["activities"] {
    return festivalActivityInquiries.reduce((activities, inquiry) => {
      const isIncluded = inquiry.fa.inquiryTimeWindows.some((period) =>
        Period.init(period).isIncluding(start),
      );

      if (!isIncluded) return activities;

      const { id, name } = inquiry.fa;
      const { quantity } = inquiry;
      const activity = { id, name, quantity };
      return [...activities, activity];
    }, []);
  }

  private static findTasksByDate(
    { festivalTaskInquiries }: DatabaseGear,
    start: Date,
  ): GearDetails["tasks"] {
    return festivalTaskInquiries.reduce((tasks, inquiry) => {
      const isIncluded = inquiry.ft.mobilizations.some((period) =>
        Period.init(period).isIncluding(start),
      );

      if (!isIncluded) return tasks;

      const { id, name } = inquiry.ft;
      const { quantity } = inquiry;
      const task = { id, name, quantity };
      return [...tasks, task];
    }, []);
  }
}
