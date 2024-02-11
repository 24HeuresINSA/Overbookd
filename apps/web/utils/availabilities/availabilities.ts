import {
  DateString,
  Hour,
  IProvidePeriod,
  OverDate,
  isHour,
} from "@overbookd/period";
import { AvailabilityDate } from "@overbookd/volunteer-availability";
import { isPartyShift } from "../shift/shift";

export const ALL_HOURS: Hour[] = Array.from(
  { length: 24 },
  (_, hour) => hour,
).filter(
  (hour): hour is Hour => isHour(hour) && isEndOfAvailabilityPeriod(hour),
);

export function isEndOfAvailabilityPeriod(hour: Hour): boolean {
  return isPartyShift(hour) || hour % 2 === 0;
}

export function isAvailabilityPeriodSelected(
  selectedAvailabilities: IProvidePeriod[],
  savedAvailabilities: IProvidePeriod[],
): (date: DateString, hour: Hour) => boolean {
  return (date: DateString, hour: Hour) => {
    const availabilityDate = AvailabilityDate.init({ date, hour });
    const isSelected = availabilityDate.isIncludedBy(selectedAvailabilities);
    const isSaved = availabilityDate.isIncludedBy(savedAvailabilities);

    return isSelected && !isSaved;
  };
}

export function isAvailabilityPeriodSaved(
  savedAvailabilities: IProvidePeriod[],
): (date: DateString, hour: Hour) => boolean {
  return (date: DateString, hour: Hour) => {
    const availabilityDate = AvailabilityDate.init({ date, hour });
    return availabilityDate.isIncludedBy(savedAvailabilities);
  };
}

export function isItAvailableDuringThisHour(
  availabilities: IProvidePeriod[],
  date: DateString,
  hour: Hour,
) {
  const overDate = OverDate.init({ date, hour });
  return overDate.isIncludedBy(availabilities);
}
