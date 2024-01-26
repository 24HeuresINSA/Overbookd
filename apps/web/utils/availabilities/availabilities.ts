import { IProvidePeriod, ONE_HOUR_IN_MS, Period } from "@overbookd/period";
import {
  AvailabilityDate,
  DateString,
  Hour,
  PeriodOrchestrator,
  isHour,
} from "@overbookd/volunteer-availability";
import { isPartyShift } from "../shift/shift";
import { isSamePeriod } from "./period";

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

export function hasAvailabilityPeriodError(
  periodOrchestrator: PeriodOrchestrator,
): (date: DateString, hour: Hour) => boolean {
  return (date: DateString, hour: Hour) => {
    const { period } = AvailabilityDate.init({ date, hour });
    return periodOrchestrator.errors.some(isSamePeriod(period));
  };
}

export function isItAvailableDuringThisHour(
  availabilities: IProvidePeriod[],
  date: DateString,
  hour: Hour,
) {
  const availabilityDate = AvailabilityDate.init({ date, hour });
  const start = availabilityDate.date;
  const end = new Date(start.getTime() + ONE_HOUR_IN_MS);
  const period = Period.init({ start, end });

  return availabilities.some((availability) =>
    period.isIncludedBy(Period.init(availability)),
  );
}
