import { IProvidePeriod, Period } from "@overbookd/period";
import { updateItemToList } from "@overbookd/list";
import { Availability } from "./volunteer-availability";

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
      const isPeriodIncluded = period.isIncludedBy(currentPeriod);
      if (!isPeriodIncluded) return [...periods, currentPeriod];

      const splitedPeriods = currentPeriod.splitFrom(period);
      return [...periods, ...splitedPeriods];
    }, [] as Period[]);
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
      period.isFollowedBy(otherPeriod),
    );
    if (mergeablePeriodIndex === -1) return [...periods, period];
    return PeriodOrchestrator.mergePeriodToPeriodList(
      periods,
      mergeablePeriodIndex,
      period,
    );
  }

  private static isMergeableFromOneOf(
    periods: Period[],
  ): (value: Period, index: number) => boolean {
    return (period, startIndex) => {
      return periods
        .slice(startIndex + 1)
        .some((otherPeriod) => period.isFollowedBy(otherPeriod));
    };
  }

  private static mergePeriodToPeriodList(
    periods: Period[],
    mergeablePeriodIndex: number,
    period: Period,
  ) {
    const mergeablePeriod = periods.at(mergeablePeriodIndex);

    if (!mergeablePeriod) return periods;

    const mergedPeriod = period.mergeWith(mergeablePeriod);
    return updateItemToList(periods, mergeablePeriodIndex, mergedPeriod);
  }
}
