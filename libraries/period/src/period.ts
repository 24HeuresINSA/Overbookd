import { Duration } from "./duration";

export type IProvidePeriod = {
  start: Date;
  end: Date;
};

export const END_BEFORE_START_ERROR_MESSAGE =
  "❌ La date de fin doit être après la date de début";

export class EndBeforeStart extends Error {
  constructor() {
    super(END_BEFORE_START_ERROR_MESSAGE);
  }
}

type ErrorMessage = typeof END_BEFORE_START_ERROR_MESSAGE;

export class Period {
  start: Date;
  end: Date;

  private constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  get hasDuration(): boolean {
    return this.start.getTime() !== this.end.getTime();
  }

  static init({ start, end }: IProvidePeriod): Period {
    if (this.isEndBeforeStart({ start, end })) {
      throw new EndBeforeStart();
    }
    return new Period(start, end);
  }

  static isValid(period: IProvidePeriod): boolean {
    return this.errors(period).length === 0;
  }

  static errors(period: IProvidePeriod): ErrorMessage[] {
    return Period.isEndBeforeStart(period)
      ? [END_BEFORE_START_ERROR_MESSAGE]
      : [];
  }

  private static isEndBeforeStart({ start, end }: IProvidePeriod): boolean {
    return end.getTime() < start.getTime();
  }

  isOverlapping(otherPeriod: Period): boolean {
    return (
      this.start.getTime() < otherPeriod.end.getTime() &&
      this.end.getTime() > otherPeriod.start.getTime()
    );
  }

  includes(otherPeriod: Period): boolean {
    return (
      this.start.getTime() <= otherPeriod.start.getTime() &&
      this.end.getTime() >= otherPeriod.end.getTime()
    );
  }

  isIncluding(date: Date): boolean {
    const happenAfterStart = date.getTime() >= this.start.getTime();
    const happenBeforeEnd = date.getTime() < this.end.getTime();
    return happenAfterStart && happenBeforeEnd;
  }

  isFollowedBy(otherPeriod: Period): boolean {
    return (
      this.start.getTime() <= otherPeriod.end.getTime() &&
      this.end.getTime() >= otherPeriod.start.getTime()
    );
  }

  mergeWith(otherPeriod: Period): Period {
    const start = new Date(
      Math.min(otherPeriod.start.getTime(), this.start.getTime()),
    );
    const end = new Date(
      Math.max(otherPeriod.end.getTime(), this.end.getTime()),
    );
    return new Period(start, end);
  }

  splitFrom(otherPeriod: IProvidePeriod): Period[] {
    const pastPeriod = Period.init({
      start: this.start,
      end: otherPeriod.start,
    });
    const futurPeriod = Period.init({
      start: otherPeriod.end,
      end: this.end,
    });

    return [pastPeriod, futurPeriod].filter((period) => period.hasDuration);
  }

  static mergeContiguous(periods: Period[]): Period[] {
    const sortedPeriods = this.sort(periods);

    return sortedPeriods.reduce(
      (mergedPeriods: Period[], currentPeriod: Period) => {
        const lastMergedPeriod = mergedPeriods.at(mergedPeriods.length - 1);
        if (!lastMergedPeriod) return [currentPeriod];

        const isMergeable = lastMergedPeriod.isFollowedBy(currentPeriod);
        if (isMergeable) {
          const mergedPeriod = lastMergedPeriod.mergeWith(currentPeriod);
          return [...mergedPeriods.slice(0, -1), mergedPeriod];
        }

        return [...mergedPeriods, currentPeriod];
      },
      [],
    );
  }

  splitWithIntervalInMs(intervalInMs: number): Period[] {
    const periodCount = Math.ceil(
      (this.end.getTime() - this.start.getTime()) / intervalInMs,
    );

    return Array.from({ length: periodCount }, (_, index) => {
      const start = new Date(this.start.getTime() + index * intervalInMs);
      const end = new Date(start.getTime() + intervalInMs);
      return Period.init({ start, end: end < this.end ? end : this.end });
    });
  }

  static sort<T extends IProvidePeriod>(periods: T[]): T[] {
    return periods.sort(
      (a, b) =>
        a.start.getTime() - b.start.getTime() ||
        a.end.getTime() - b.end.getTime(),
    );
  }

  get duration(): Duration {
    const startTimestamp = this.start.getTime();
    const endTimestamp = this.end.getTime();
    return Duration.ms(endTimestamp - startTimestamp);
  }
}
