import { IProvidePeriod } from "@overbookd/period";

export function arePeriodsOverlapping([first, second]: [
  IProvidePeriod,
  IProvidePeriod,
]): boolean {
  return (
    first.start.getTime() < second.end.getTime() &&
    first.end.getTime() > second.start.getTime()
  );
}

export function includesOtherPeriod(
  period: IProvidePeriod,
): (value: IProvidePeriod) => boolean {
  return (p) =>
    period.start.getTime() <= p.start.getTime() &&
    period.end.getTime() >= p.end.getTime();
}
