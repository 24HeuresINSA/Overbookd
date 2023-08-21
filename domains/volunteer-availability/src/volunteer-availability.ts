import { IProvidePeriod, TWO_HOURS_IN_MS } from '@overbookd/period';
import { SHIFT_HOURS_UTC } from './shift.constant';
import {
  AvailabilityMinimumPeriodDurationError,
  AvailabilityPeriodsJointError,
  AvailabilityPeriodTimelineError,
  AvailabilityStartError,
} from './volunteer-availability.error';

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

  addPeriod(period: IProvidePeriod): Availability {
    if (!this.isJointedPeriod(period))
      throw new AvailabilityPeriodsJointError();
    const startTime = Math.min(
      new Date(this.start).getTime(),
      new Date(period.start).getTime(),
    );
    const endTime = Math.max(
      new Date(this.end).getTime(),
      new Date(period.end).getTime(),
    );
    return new Availability(new Date(startTime), new Date(endTime));
  }

  canMerge({ start, end }: Availability): boolean {
    return this.isJointedPeriod({ start, end });
  }

  private isJointedPeriod(period: IProvidePeriod): boolean {
    return this.start <= period.end && this.end >= period.start;
  }

  private lastLessThanTwoHours(start: Date, end: Date) {
    return (
      new Date(end).getTime() - new Date(start).getTime() < TWO_HOURS_IN_MS
    );
  }

  private invalidPeriodTimeline(start: Date, end: Date) {
    return new Date(start).getTime() >= new Date(end).getTime();
  }

  private isOddHourDuringNightOrDayShift(start: Date) {
    return (
      new Date(start).getUTCHours() > SHIFT_HOURS_UTC.NIGHT &&
      new Date(start).getUTCHours() < SHIFT_HOURS_UTC.PARTY &&
      new Date(start).getUTCHours() % 2 !== 0
    );
  }

  static fromPeriod(period: IProvidePeriod) {
    return new Availability(period.start, period.end);
  }
}
