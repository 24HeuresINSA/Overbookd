export interface IProvidePeriod {
  start: Date;
  end: Date;
}

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

  isIncludedBy(otherPeriod: Period): boolean {
    return (
      otherPeriod.start.getTime() <= this.start.getTime() &&
      otherPeriod.end.getTime() >= this.start.getTime()
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

  get hasDuration(): boolean {
    return this.start.getTime() !== this.end.getTime();
  }

  static mergeAdjacents(periods: Period[]): Period[] {
    const sortedPeriods = periods.sort((a, b) =>
      a.start.getTime() < b.start.getTime() ? -1 : 1,
    );

    return sortedPeriods.map((currentPeriod, index) => {
      let mergedPeriod = currentPeriod;

      // Merge with adjacent or overlapping periods
      while (index < sortedPeriods.length - 1) {
        const nextPeriod = sortedPeriods[index + 1];

        if (mergedPeriod.isFollowedBy(nextPeriod)) {
          mergedPeriod = mergedPeriod.mergeWith(nextPeriod);
          index++;
        } else {
          break;
        }
      }

      return mergedPeriod;
    });
  }

  splitWithIntervalInMs(intervalInMs: number): Period[] {
    const periods: Period[] = [];

    for (
      let currentTime = this.start.getTime();
      currentTime < this.end.getTime();
      currentTime += intervalInMs
    ) {
      const start = new Date(currentTime);
      const end = new Date(currentTime + intervalInMs);
      periods.push(Period.init({ start, end }));
    }

    return periods;
  }

  static sort(periods: Period[]): Period[] {
    return periods.sort(
      (a, b) =>
        a.start.getTime() - b.start.getTime() ||
        b.end.getTime() - a.end.getTime(),
    );
  }
}
