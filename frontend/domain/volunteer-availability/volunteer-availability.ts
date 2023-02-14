import { Period } from "~/utils/models/period";
import {
  AvailabilityMinimumPeriodDurationError,
  AvailabilityPeriodsJointError,
  AvailabilityPeriodTimelineError,
  AvailabilityStartError,
} from "./volunteer-availability.error";

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

export class Availability {
  public start: Date;
  public end: Date;

  private constructor(start: Date, end: Date) {
    if (this.invalidPeriodTimeline(start, end)) {
      throw new AvailabilityPeriodTimelineError();
    }
    if (this.isOddHourDuringNightOrDayShift(start)) {
      throw new AvailabilityStartError();
    }
    if (this.lastLessThanTwoHours(start, end)) {
      throw new AvailabilityMinimumPeriodDurationError();
    }
    this.start = start;
    this.end = end;
  }

  addPeriod(period: Period): Availability {
    if (!this.isJointedPeriod(period))
      throw new AvailabilityPeriodsJointError();
    const startTime = Math.min(this.start.getTime(), period.start.getTime());
    const endTime = Math.max(this.end.getTime(), period.end.getTime());
    return new Availability(new Date(startTime), new Date(endTime));
  }

  canMerge({ start, end }: Availability): boolean {
    return this.isJointedPeriod({ start, end });
  }

  private isJointedPeriod(period: Period): boolean {
    return this.start <= period.end && this.end >= period.start;
  }

  private lastLessThanTwoHours(start: Date, end: Date) {
    return end.getTime() - start.getTime() < TWO_HOURS_IN_MS;
  }

  private invalidPeriodTimeline(start: Date, end: Date) {
    return start.getTime() >= end.getTime();
  }

  private isOddHourDuringNightOrDayShift(start: Date) {
    return (
      start.getHours() > 6 &&
      start.getHours() < 18 &&
      start.getHours() % 2 !== 0
    );
  }

  static fromPeriod(period: Period) {
    return new Availability(period.start, period.end);
  }
}
