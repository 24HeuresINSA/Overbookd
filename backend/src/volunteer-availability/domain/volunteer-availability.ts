import { SHIFT_HOURS_UTC } from '../../shift/shift.constant';
import { ONE_HOUR_IN_MS } from '../../utils/date';
import { Period } from './period.model';
import {
  AvailabilityMinimumPeriodDurationError,
  AvailabilityPeriodsJointError,
  AvailabilityPeriodTimelineError,
  AvailabilityStartError,
} from './volunteer-availability.error';

const TWO_HOURS_IN_MS = 2 * ONE_HOUR_IN_MS;

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

  private isJointedPeriod(period: Period): boolean {
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

  static fromPeriod(period: Period) {
    return new Availability(period.start, period.end);
  }
}
