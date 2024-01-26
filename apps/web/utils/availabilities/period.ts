import { IProvidePeriod } from "@overbookd/period";
import { isPartyShift } from "../shift/shift";

export function isSamePeriod(
  period: IProvidePeriod,
): (value: IProvidePeriod) => boolean {
  return (otherPeriod) =>
    period.start.getTime() === otherPeriod.start.getTime() &&
    period.end.getTime() === otherPeriod.end.getTime();
}

export function getPeriodDurationInHours(hour: number): number {
  return isPartyShift(hour) ? 1 : 2;
}
