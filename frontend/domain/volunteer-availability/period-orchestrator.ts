import { updateItemToList } from "../../utils/functions/list";
import { Period } from "../../utils/models/period";
import { Availability } from "./volunteer-availability";

export class PeriodOrchestrator {
  private periods: Period[] = [];

  private constructor(periods: Period[]) {
    this.periods = periods;
  }

  static init(periods?: Period[]) {
    return new PeriodOrchestrator(periods ?? []);
  }

  addPeriod(period: Period) {
    this.periods = [...this.periods, period];
  }

  get errors(): (Period & { message: string })[] {
    return this.availabilityPeriods
      .filter((period) => {
        try {
          Availability.fromPeriod(period);
          return false;
        } catch (e) {
          return true;
        }
      })
      .map((period) => ({
        ...period,
        message: "La période doit durer au moins 2 heures",
      }));
  }

  get availabilityPeriods(): Period[] {
    return this.periods.reduce(
      PeriodOrchestrator.reduceToMergedPeriods,
      [] as Period[]
    );
  }

  private static reduceToMergedPeriods(periods: Period[], period: Period) {
    const mergeablePeriodIndex = periods.findIndex(
      PeriodOrchestrator.isFollowingPeriod(period)
    );
    if (mergeablePeriodIndex === -1) {
      return [...periods, period];
    }
    const mergeablePeriod = periods[mergeablePeriodIndex];
    const mergedPeriod = {
      start: new Date(
        Math.min(mergeablePeriod.start.getTime(), period.start.getTime())
      ),
      end: new Date(
        Math.max(mergeablePeriod.end.getTime(), period.end.getTime())
      ),
    };
    return updateItemToList(periods, mergeablePeriodIndex, mergedPeriod);
  }

  private static isFollowingPeriod(period: Period): (value: Period) => boolean {
    return (p) => {
      return (
        p.start.getTime() === period.end.getTime() ||
        p.end.getTime() === period.start.getTime()
      );
    };
  }
}
