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
    const stockDiscrepancy = DashboardGear.computeMinStockDiscrepancyOn(gear);
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

    const details = periods.map(({ start, end }) => {
      const stock = DashboardGear.findStockByDate(gear);
      const inquiry = DashboardGear.findInquiryQuantityByDate(gear, start);
      const activities = DashboardGear.findActivitiesByDate(
        gear.festivalActivityInquiries,
        start,
      );
      const tasks = DashboardGear.findTasksByDate(
        gear.festivalTaskInquiries,
        start,
      );
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

    return DashboardGear.computeStockDiscrepancyOnDetails(gear, details);
  }

  private static computeMinStockDiscrepancyOn(gear: DatabaseGear): number {
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
    activities: DatabaseActivityInquiry[],
    start: Date,
  ): GearDetails["activities"] {
    return activities.reduce((activities, inquiry) => {
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
    tasks: DatabaseTaskInquiry[],
    start: Date,
  ): GearDetails["tasks"] {
    return tasks.reduce((tasks, inquiry) => {
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

  private static computeStockDiscrepancyOnDetails(
    gear: DatabaseGear,
    details: Omit<GearDetails, "stockDiscrepancy">[],
  ): GearDetails[] {
    if (!gear.isConsumable) {
      return details.map((detail) => {
        const stockDiscrepancy = detail.stock - detail.inquiry;
        return { ...detail, stockDiscrepancy };
      });
    }

    let totalInquiryQuantity = 0;
    let remainingActivities = gear.festivalActivityInquiries;
    let remainingTasks = gear.festivalTaskInquiries;

    return details.map((detail) => {
      // find inquiries that have not yet been processed
      const activities = DashboardGear.findActivitiesByDate(
        remainingActivities,
        detail.start,
      );
      const tasks = DashboardGear.findTasksByDate(remainingTasks, detail.start);
      const inquiries = [...activities, ...tasks];

      // compute total inquiry quantity
      const inquiryQuantity = inquiries.reduce(
        (total, inquiry) => total + inquiry.quantity,
        0,
      );
      totalInquiryQuantity += inquiryQuantity;

      // remove processed inquiries from the remaining ones
      remainingActivities = remainingActivities.filter(
        (inquiry) =>
          !activities.some((activity) => activity.id === inquiry.fa.id),
      );
      remainingTasks = remainingTasks.filter(
        (inquiry) => !tasks.some((task) => task.id === inquiry.ft.id),
      );

      const stockDiscrepancy = detail.stock - totalInquiryQuantity;
      return { ...detail, stockDiscrepancy };
    });
  }
}
