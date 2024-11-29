import { GearDetails } from "@overbookd/http";
import {
  DatabaseActivityInquiry,
  DatabaseDashboardGear,
  DatabaseTaskInquiry,
} from "./dashboard.model";
import { Period } from "@overbookd/time";
import { sumQuantity } from "./sum-quantity";

export class DashboardGearInquiry {
  private constructor() {}

  static computeGearInquiries(gear: DatabaseDashboardGear, date: Date) {
    const activities = DashboardGearInquiry.findActivitiesUsingGearAt(
      gear.festivalActivityInquiries,
      date,
    );
    const tasks = DashboardGearInquiry.findTasksUsingGearAt(
      gear.festivalTaskInquiries,
      date,
    );
    const inquiry = DashboardGearInquiry.computeInquiryQuantity(
      activities,
      tasks,
    );
    return { inquiry, tasks, activities };
  }

  static computeConsumableInquiries(gear: DatabaseDashboardGear, date: Date) {
    const activities = DashboardGearInquiry.findActivitiesTakingConsumableAt(
      gear.festivalActivityInquiries,
      date,
    );
    const tasks = DashboardGearInquiry.findTasksTakingConsumableAt(
      gear.festivalTaskInquiries,
      date,
    );
    const inquiry = DashboardGearInquiry.computeInquiryQuantity(
      activities,
      tasks,
    );
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

  static computeConsumedQuantityByDateOn(
    gear: DatabaseDashboardGear,
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
