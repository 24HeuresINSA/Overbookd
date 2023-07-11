import { Period } from '@overbookd/period';

export function arePeriodsOverlapping([first, second]: [
  Period,
  Period,
]): boolean {
  return (
    first.start.getTime() < second.end.getTime() &&
    first.end.getTime() > second.start.getTime()
  );
}

export function includesOtherPeriod(
  period: Period,
): (value: Period) => boolean {
  return (p) =>
    period.start.getTime() <= p.start.getTime() &&
    period.end.getTime() >= p.end.getTime();
}

export function areSamePeriods([first, second]: [Period, Period]): boolean {
  return (
    first.start.getTime() === second.start.getTime() &&
    first.end.getTime() === second.end.getTime()
  );
}
