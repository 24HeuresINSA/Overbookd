import {
  type Hour,
  type IProvidePeriod,
  OverDate,
  Period,
  isHour,
} from "@overbookd/time";
import { isPartyShift } from "../shift.utils";
import type { SavedCharismaPeriod } from "@overbookd/http";

export type AvailabilityEvent = IProvidePeriod & {
  charisma: number;
};

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

export function findCharismaPerHour(
  charismaPeriods: SavedCharismaPeriod[],
  date: Date,
): number {
  const charismaPeriod = charismaPeriods.find((cp) =>
    Period.init({ start: cp.start, end: cp.end }).isIncluding(date),
  );
  if (!charismaPeriod) return 0;
  const isOneHourShift = isPartyShift(date.getHours());
  return isOneHourShift ? charismaPeriod.charisma : charismaPeriod.charisma * 2;
}
