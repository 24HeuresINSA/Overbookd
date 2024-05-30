import { IProvidePeriod } from "@overbookd/period";

export function isSamePeriod(
  period: IProvidePeriod,
): (value: IProvidePeriod) => boolean {
  return (otherPeriod) =>
    period.start.getTime() === otherPeriod.start.getTime() &&
    period.end.getTime() === otherPeriod.end.getTime();
}
