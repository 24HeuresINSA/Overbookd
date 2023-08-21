import { IProvidePeriod, Period } from '@overbookd/period';
import { isPartyShift } from '../shift/shift';

export function isSamePeriod(
  period: IProvidePeriod
): (value: IProvidePeriod) => boolean {
  return (otherPeriod) =>
    period.start.getTime() === otherPeriod.start.getTime() &&
    period.end.getTime() === otherPeriod.end.getTime();
}

export function isDateIncludedByPeriod(
  date: Date
): (value: IProvidePeriod) => boolean {
  return (period) => period.start <= date && period.end > date;
}

export function generateNewPeriod(date: Date): Period {
  const durationInHours = getPeriodDurationInHours(date.getHours());
  const start = new Date(date);
  const end = new Date(start);
  end.setHours(date.getHours() + durationInHours);
  return Period.init({ start, end });
}

export function getPeriodDurationInHours(hour: number): number {
  return isPartyShift(hour) ? 1 : 2;
}
