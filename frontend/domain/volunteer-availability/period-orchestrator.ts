import { updateItemToList } from "../../utils/functions/list";
import { Period } from "../../utils/models/period";
import { Availability } from "./volunteer-availability";

export type PeriodWithError = Period & {
  message: string;
};

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

  removePeriod(period: Period) {
    this.periods = this.periods.reduce((periods, currentPeriod) => {
      const isPeriodIncluded = this.isPeriodIncludedBy(period)(currentPeriod);
      if (!isPeriodIncluded) return [...periods, currentPeriod];

      const splitedPeriods = this.splitPeriod(currentPeriod, period);
      return [
        ...periods,
        ...splitedPeriods.filter(PeriodOrchestrator.hasDuration),
      ];
    }, [] as Period[]);
  }

  private splitPeriod(currentPeriod: Period, period: Period): Period[] {
    const pastPeriod = {
      start: currentPeriod.start,
      end: period.start,
    };
    const futurPeriod = {
      start: period.end,
      end: currentPeriod.end,
    };
    return [pastPeriod, futurPeriod];
  }

  private isPeriodIncludedBy(period: Period): (value: Period) => boolean {
    return (p) =>
      p.start.getTime() <= period.start.getTime() &&
      p.end.getTime() >= period.end.getTime();
  }

  private static hasDuration(period: Period): boolean {
    return period.start.getTime() !== period.end.getTime();
  }

  get errors(): PeriodWithError[] {
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
        Math.min(
          new Date(mergeablePeriod.start).getTime(),
          new Date(period.start).getTime()
        )
      ),
      end: new Date(
        Math.max(
          new Date(mergeablePeriod.end).getTime(),
          new Date(period.end).getTime()
        )
      ),
    };
    return updateItemToList(periods, mergeablePeriodIndex, mergedPeriod);
  }

  private static isFollowingPeriod(period: Period): (value: Period) => boolean {
    return (existingPeriod) => {
      return (
        new Date(existingPeriod.start).getTime() <=
          new Date(period.end).getTime() &&
        new Date(existingPeriod.end).getTime() >=
          new Date(period.start).getTime()
      );
    };
  }
}
