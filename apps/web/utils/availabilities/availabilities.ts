import {
  type Hour,
  type IProvidePeriod,
  OverDate,
  isHour,
} from "@overbookd/time";
import { isPartyShift } from "~/utils/shift.utils";

export const ALL_HOURS: Hour[] = Array.from(
  { length: 24 },
  (_, hour) => hour,
).filter(
  (hour): hour is Hour => isHour(hour) && isEndOfAvailabilityPeriod(hour),
);

export function isEndOfAvailabilityPeriod(hour: Hour): boolean {
  return isPartyShift(hour) || hour % 2 === 0;
}

export function isItAvailableDuringThisHour(
  availabilities: IProvidePeriod[],
  overDate: OverDate,
) {
  return overDate.isIncludedBy(availabilities);
}
