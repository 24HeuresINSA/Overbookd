import { GearDetails, GearPreview } from "@overbookd/http";
import {
  DatabaseActivityInquiry,
  DatabaseGear,
  DatabaseTaskInquiry,
} from "./dashboard.model";
import { IProvidePeriod, Period, QUARTER_IN_MS } from "@overbookd/period";

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

    return periods.map((period) => {
      return DashboardGear.periodDetails(gear, period);
    });
  }

  private static computeMinStockDiscrepancyOn(gear: DatabaseGear): number {
    const activityTimeWindows = gear.festivalActivityInquiries
      .flatMap((inquiry) => inquiry.fa.inquiryTimeWindows)
      .map((period) => Period.init(period));
    const taskTimeWindows = gear.festivalTaskInquiries
      .flatMap((inquiry) => inquiry.ft.mobilizations)
      .map((period) => Period.init(period));
    const inquiryTimeWindows = [...activityTimeWindows, ...taskTimeWindows];

    const mergedTimeWindows = gear.isConsumable
      ? inquiryTimeWindows
      : Period.mergeContiguous(inquiryTimeWindows);

    const discrepancies = mergedTimeWindows.map((timeWindow) => {
      return DashboardGear.computeStockDiscrepancyByTimeWindowOn(
        gear,
        timeWindow,
      );
    });

    return discrepancies.length > 0 ? Math.min(...discrepancies) : 0;
  }

  private static periodDetails(gear: DatabaseGear, period: IProvidePeriod) {
    const inventory = DashboardGear.findInventoryQuantity(gear);
    if (!gear.isConsumable) {
      return DashboardGear.gearPeriodDetails(gear, inventory, period);
    }
    return DashboardGear.consumablePeriodDetails(gear, inventory, period);
  }

  private static consumablePeriodDetails(
    gear: DatabaseGear,
    inventory: number,
    { start, end }: IProvidePeriod,
  ) {
    const { inquiry, activities, tasks } =
      DashboardGear.computeConsumableInquiries(gear, start);
    const consumed = DashboardGear.computeConsumedQuantityByDateOn(gear, start);

    const stock = inventory - consumed;

    return {
      start,
      end,
      inquiry,
      stock,
      activities,
      tasks,
      inventory,
      consumed,
    };
  }

  private static gearPeriodDetails(
    gear: DatabaseGear,
    inventory: number,
    { end, start }: IProvidePeriod,
  ) {
    const { inquiry, tasks, activities } = DashboardGear.computeGearInquiries(
      gear,
      start,
    );
    const stock = inventory;
    return { start, end, inquiry, stock, tasks, activities, inventory };
  }

  private static computeGearInquiries(gear: DatabaseGear, date: Date) {
    const activities = DashboardGear.findActivitiesUsingGearAt(
      gear.festivalActivityInquiries,
      date,
    );
    const tasks = DashboardGear.findTasksUsingGearAt(
      gear.festivalTaskInquiries,
      date,
    );
    const inquiry = DashboardGear.computeInquiryQuantity(activities, tasks);
    return { inquiry, tasks, activities };
  }

  private static computeConsumableInquiries(gear: DatabaseGear, date: Date) {
    const activities = DashboardGear.findActivitiesTakingConsumableAt(
      gear.festivalActivityInquiries,
      date,
    );
    const tasks = DashboardGear.findTasksTakingConsumableAt(
      gear.festivalTaskInquiries,
      date,
    );
    const inquiry = DashboardGear.computeInquiryQuantity(activities, tasks);
    return { inquiry, activities, tasks };
  }

  private static findActivitiesTakingConsumableAt(
    activities: DatabaseActivityInquiry[],
    date: Date,
  ) {
    return activities.reduce((activities, inquiry) => {
      const isStartingAt = inquiry.fa.inquiryTimeWindows.some(
        (period) => +period.start === +date,
      );

      if (!isStartingAt) return activities;

      const { id, name } = inquiry.fa;
      const { quantity } = inquiry;
      const activity = { id, name, quantity };
      return [...activities, activity];
    }, []);
  }

  private static findTasksTakingConsumableAt(
    tasks: DatabaseTaskInquiry[],
    date: Date,
  ) {
    return tasks.reduce((tasks, inquiry) => {
      const isStartingAt = inquiry.ft.mobilizations.some(
        (period) => +period.start === +date,
      );

      if (!isStartingAt) return tasks;

      const { id, name } = inquiry.ft;
      const { quantity } = inquiry;
      const task = { id, name, quantity };
      return [...tasks, task];
    }, []);
  }

  private static computeInquiryQuantity(
    activities: GearDetails["activities"],
    tasks: GearDetails["tasks"],
  ) {
    return sumQuantity([...activities, ...tasks]);
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
    const { inquiry } = gear.isConsumable
      ? DashboardGear.computeConsumableInquiries(gear, date)
      : DashboardGear.computeGearInquiries(gear, date);
    const consumed = gear.isConsumable
      ? DashboardGear.computeConsumedQuantityByDateOn(gear, date)
      : 0;
    return stock - (inquiry + consumed);
  }

  private static findStockByDate(gear: DatabaseGear /*, date: Date*/): number {
    // Date will be used in for purchases & borrows
    return DashboardGear.findInventoryQuantity(gear);
  }

  private static findInventoryQuantity(gear: DatabaseGear): number {
    return sumQuantity(gear.inventoryRecords);
  }

  private static findActivitiesUsingGearAt(
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

  private static findTasksUsingGearAt(
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
      ({ period: { start } }) => +start < +date,
    );
    return sumQuantity(pastInquiries);
  }
}

function sumQuantity(list: { quantity: number }[]): number {
  return list.reduce((count, { quantity }) => count + quantity, 0);
}
