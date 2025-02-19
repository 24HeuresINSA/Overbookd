import { IProvidePeriod, Period } from "@overbookd/time";
import { updateItemToList } from "@overbookd/list";
import { Availability } from "./volunteer-availability.js";

export type PeriodWithError = IProvidePeriod & {
  message: string;
};

export class PeriodOrchestrator {
  private periods: Period[] = [];

  private constructor(periods: IProvidePeriod[]) {
    this.periods = periods.map((period) => Period.init(period));
  }

  static init(periods?: IProvidePeriod[]) {
    return new PeriodOrchestrator(periods ?? []);
  }

  addPeriod(period: Period) {
    const periods = [...this.periods, period];
    this.periods = this.mergePeriods(periods);
  }

  removePeriod(period: Period) {
    this.periods = this.periods.reduce((periods, currentPeriod) => {
      const isPeriodIncluded = period.isOverlapping(currentPeriod);
      if (!isPeriodIncluded) return [...periods, currentPeriod];

      const remainingPeriods = currentPeriod.substract(period);
      return [...periods, ...remainingPeriods];
    }, [] as Period[]);
  }

  areNewPeriodsAdded(maybeNewPeriods: IProvidePeriod[]) {
    return maybeNewPeriods.some(
      (newPeriod) =>
        !this.periods.some(
          (period) =>
            period.start.getTime() <= newPeriod.start.getTime() &&
            newPeriod.end.getTime() <= period.end.getTime(),
        ),
    );
  }

  get errors(): PeriodWithError[] {
    return this.availabilityPeriods
      .filter((period) => {
        try {
          Availability.fromPeriod(period);
          return false;
        } catch (_error) {
          return true;
        }
      })
      .map((period) => ({
        ...period,
        message: "La période doit durer au moins 2 heures",
      }));
  }

  get availabilityPeriods(): Period[] {
    return this.periods;
  }

  private mergePeriods(periods: Period[]): Period[] {
    if (!this.canMergeAtLeastOnePeriod(periods)) return periods;
    return this.mergePeriods(
      periods.reduce(PeriodOrchestrator.reduceToMergedPeriods, [] as Period[]),
    );
  }

  private canMergeAtLeastOnePeriod(periods: Period[]): boolean {
    return periods.some(PeriodOrchestrator.isMergeableFromOneOf(periods));
  }

  private static reduceToMergedPeriods(
    periods: Period[],
    period: Period,
  ): Period[] {
    const mergeablePeriodIndex = periods.findIndex((otherPeriod) =>
      period.isMergableWith(otherPeriod),
    );
    const mergeablePeriod = periods.at(mergeablePeriodIndex);

    if (mergeablePeriodIndex === -1 || !mergeablePeriod) {
      return [...periods, period];
    }

    const mergedPeriod = period.mergeWith(mergeablePeriod);
    return updateItemToList(periods, mergeablePeriodIndex, mergedPeriod);
  }

  private static isMergeableFromOneOf(
    periods: Period[],
  ): (value: Period, index: number) => boolean {
    return (period, startIndex) => {
      return periods
        .slice(startIndex + 1)
        .some((otherPeriod) => period.isMergableWith(otherPeriod));
    };
  }
}
