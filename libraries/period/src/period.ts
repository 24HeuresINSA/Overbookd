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
}
