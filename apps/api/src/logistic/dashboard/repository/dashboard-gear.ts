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

    return periods.map(({ start, end }) => {
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
      const consumed = gear.isConsumable
        ? {
            consumed: DashboardGear.computeConsumedQuantityByDateOn(
              gear,
              start,
            ),
          }
        : {};
      const stock = inventory - (consumed.consumed ?? 0);

      return {
        start,
        end,
        inquiry,
        stock,
        activities,
        tasks,
        inventory,
        ...consumed,
      };
    });
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

  private static computeConsumedQuantityByDateOn(
    gear: DatabaseGear,
    date: Date,
  ): number {
    const faInquiries = gear.festivalActivityInquiries.flatMap(
      ({ quantity, fa }) => {
        const periods = fa.inquiryTimeWindows.map((period) =>
          Period.init(period),
        );
        return periods.map((period) => ({ quantity, period }));
      },
    );
    const ftInquiries = gear.festivalTaskInquiries.flatMap(
      ({ quantity, ft }) => {
        const periods = Period.mergeContiguous(
          ft.mobilizations.map((mobilization) => Period.init(mobilization)),
        );
        return periods.map((period) => ({ quantity, period }));
      },
    );
    const pastInquiries = [...faInquiries, ...ftInquiries].filter(
      ({ period: { end } }) => +end <= +date,
    );
    return pastInquiries.reduce(
      (consumed, { quantity }) => consumed + quantity,
      0,
    );
  }
}
