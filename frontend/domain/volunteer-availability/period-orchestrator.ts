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
    return this.mergePeriods(this.periods);
  }

  private mergePeriods(periods: Period[]): Period[] {
    if (!this.canMergeAtLeastOnePeriod(periods)) return periods;
    return this.mergePeriods(
      periods.reduce(PeriodOrchestrator.reduceToMergedPeriods, [] as Period[])
    );
  }

  private canMergeAtLeastOnePeriod(periods: Period[]): boolean {
    return periods.some(PeriodOrchestrator.isMergeableFromOneOf(periods));
  }

  private static reduceToMergedPeriods(
    periods: Period[],
    period: Period
  ): Period[] {
    const mergeablePeriodIndex = periods.findIndex(
      PeriodOrchestrator.isFollowingPeriod(period)
    );
    if (mergeablePeriodIndex === -1) return [...periods, period];
    return PeriodOrchestrator.mergePeriodToPeriodList(
      periods,
      mergeablePeriodIndex,
      period
    );
  }

  private static isMergeableFromOneOf(
    periods: Period[]
  ): (value: Period, index: number) => boolean {
    return (period, startIndex) => {
      return periods
        .slice(startIndex + 1)
        .some(PeriodOrchestrator.isFollowingPeriod(period));
    };
  }

  private static mergePeriodToPeriodList(
    periods: Period[],
    mergeablePeriodIndex: number,
    period: Period
  ) {
    const mergeablePeriod = periods[mergeablePeriodIndex];
    const mergedPeriod = {
      start: new Date(
        Math.min(mergeablePeriod.start.getTime(), period.start.getTime())
      ),
      end: new Date(
        Math.max(mergeablePeriod.end.getTime(), period.end.getTime())
      ),
    };
    const updatedPeriods = updateItemToList(
      periods,
      mergeablePeriodIndex,
      mergedPeriod
    );
    return updatedPeriods;
  }

  private static isFollowingPeriod(period: Period): (value: Period) => boolean {
    return (existingPeriod) => {
      return (
        existingPeriod.start.getTime() === period.end.getTime() ||
        existingPeriod.end.getTime() === period.start.getTime()
      );
    };
  }
}
