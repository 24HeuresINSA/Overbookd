import {
  type Hour,
  type IProvidePeriod,
  OverDate,
  isHour,
} from "@overbookd/time";
import { SHIFT_HOURS } from "@overbookd/volunteer-availability";

export const ALL_HOURS: Hour[] = Array.from(
  { length: 24 },
  (_, hour) => hour,
).filter(
  (hour): hour is Hour => isHour(hour) && isEndOfAvailabilityPeriod(hour),
);

function isPartyShift(hour: number): boolean {
  return hour >= SHIFT_HOURS.PARTY || hour < SHIFT_HOURS.NIGHT;
}

export function isEndOfAvailabilityPeriod(hour: Hour): boolean {
  return isPartyShift(hour) || hour % 2 === 0;
}

export function isItAvailableDuringThisHour(
  availabilities: IProvidePeriod[],
  overDate: OverDate,
) {
  return overDate.isIncludedBy(availabilities);
}
