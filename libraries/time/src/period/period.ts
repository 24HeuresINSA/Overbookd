import { OverDate } from "../date/date.js";
import { ONE_DAY_IN_MS } from "../duration/duration.constant.js";
import { Duration } from "../duration/duration.js";

export type IProvidePeriod = {
  start: Date;
  end: Date;
};

export const END_BEFORE_START_ERROR_MESSAGE =
  "La date de fin doit être après la date de début";
export const NO_DURATION_ERROR_MESSAGE = "La période doit avoir une durée";

export class EndBeforeStart extends Error {
  constructor() {
    super(END_BEFORE_START_ERROR_MESSAGE);
  }
}

type ErrorMessage =
  | typeof END_BEFORE_START_ERROR_MESSAGE
  | typeof NO_DURATION_ERROR_MESSAGE;

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
    if (Period.isEndBeforeStart({ start, end })) {
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
      : Period.init(period).hasDuration
        ? []
        : [NO_DURATION_ERROR_MESSAGE];
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

  isMergableWith(otherPeriod: Period): boolean {
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

  splitOverlapping(otherPeriod: Period): Period[] {
    const [firstStart, firstEnd, secondStart, secondEnd] = [
      this.start,
      this.end,
      otherPeriod.start,
      otherPeriod.end,
    ].sort((a, b) => a.getTime() - b.getTime());

    const firstPeriod = Period.init({ start: firstStart, end: firstEnd });
    const secondPeriod = Period.init({ start: firstEnd, end: secondStart });
    const thirdPeriod = Period.init({ start: secondStart, end: secondEnd });

    return [firstPeriod, secondPeriod, thirdPeriod].filter(
      (period) => period.hasDuration,
    );
  }

  splitInto(parts: number): Period[] {
    if (parts <= 0) return [this];

    const totalDuration = this.end.getTime() - this.start.getTime();
    const partDuration = Math.floor(totalDuration / parts);

    return Array.from({ length: parts }, (_, index) => {
      const start = new Date(this.start.getTime() + index * partDuration);

      const isLastPart = index === parts - 1;
      const calculatedEnd = new Date(start.getTime() + partDuration);
      const end = isLastPart ? this.end : calculatedEnd;

      return Period.init({ start, end });
    });
  }

  substract(otherPeriod: IProvidePeriod): Period[] {
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

  remove(otherPeriod: Period): Period[] {
    if (!otherPeriod.isOverlapping(this)) {
      return [this];
    }

    return this.mergeWith(otherPeriod).substract(otherPeriod);
  }

  equals(otherPeriod: IProvidePeriod): boolean {
    const startAtSameTime =
      this.start.getTime() === otherPeriod.start.getTime();
    const endAtSameTime = this.end.getTime() === otherPeriod.end.getTime();
    return startAtSameTime && endAtSameTime;
  }

  static mergeContiguous(periods: Period[]): Period[] {
    const sortedPeriods = this.sort(periods);

    return sortedPeriods.reduce(
      (mergedPeriods: Period[], currentPeriod: Period) => {
        const lastMergedPeriod = mergedPeriods.at(mergedPeriods.length - 1);
        if (!lastMergedPeriod) return [currentPeriod];

        const isMergeable = lastMergedPeriod.isMergableWith(currentPeriod);
        if (isMergeable) {
          const mergedPeriod = lastMergedPeriod.mergeWith(currentPeriod);
          return [...mergedPeriods.slice(0, -1), mergedPeriod];
        }

        return [...mergedPeriods, currentPeriod];
      },
      [],
    );
  }

  splitWithInterval(interval: Duration): Period[] {
    const intervalInMs = interval.inMilliseconds;
    const periodCount = Math.ceil(
      (this.end.getTime() - this.start.getTime()) / intervalInMs,
    );

    return Array.from({ length: periodCount }, (_, index) => {
      const start = new Date(this.start.getTime() + index * intervalInMs);
      const end = new Date(start.getTime() + intervalInMs);
      return Period.init({ start, end: end < this.end ? end : this.end });
    });
  }

  isInDay(day: Date): boolean {
    const dayString = OverDate.from(day).dateString;
    const dayStart = OverDate.init({ date: dayString, hour: 0, minute: 0 });
    const dayEnd = OverDate.from(dayStart.date.getTime() + ONE_DAY_IN_MS);
    return this.isOverlapping(
      Period.init({ start: dayStart.date, end: dayEnd.date }),
    );
  }

  toString(): string {
    const start = this.formatDate(this.start);
    const end = this.formatDate(this.end);
    return `${start} - ${end}`;
  }

  private formatDate(date: Date): string {
    const displayOptions: Intl.DateTimeFormatOptions = {
      dateStyle: "long",
      timeStyle: "short",
    };
    return new Intl.DateTimeFormat("fr", displayOptions).format(date);
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

  get id(): string {
    const startMinutes = Duration.ms(this.start.getTime()).inMinutes;
    const endMinutes = Duration.ms(this.end.getTime()).inMinutes;

    return `${startMinutes}-${endMinutes}`;
  }
}
