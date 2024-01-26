import { IProvidePeriod } from "@overbookd/period";
import { PeriodOrchestrator } from "@overbookd/volunteer-availability";
import { setDateHour } from "../date/date.utils";
import { isPartyShift } from "../shift/shift";
import {
  generateNewPeriod,
  isDateIncludedByPeriod,
  isSamePeriod,
} from "./period";

export const ALL_HOURS = Array.from({ length: 24 }, (_, hour) => hour).filter(
  isEndOfAvailabilityPeriod,
);

export function isEndOfAvailabilityPeriod(hour: number): boolean {
  return isPartyShift(hour) || hour % 2 === 0;
}

export function isAvailabilityPeriodSelected(
  selectedAvailabilities: IProvidePeriod[],
  savedAvailabilities: IProvidePeriod[],
): (date: string | Date, hour: number) => boolean {
  return (date: string | Date, hour: number) =>
    selectedAvailabilities.some(
      isDateIncludedByPeriod(setDateHour(new Date(date), hour)),
    ) && !isAvailabilityPeriodSaved(savedAvailabilities)(date, hour);
}

export function isAvailabilityPeriodSaved(
  savedAvailabilities: IProvidePeriod[],
): (date: string | Date, hour: number) => boolean {
  return (date: string | Date, hour: number) => {
    const updatedDate = setDateHour(new Date(date), hour);
    return savedAvailabilities.some(isDateIncludedByPeriod(updatedDate));
  };
}

export function hasAvailabilityPeriodError(
  periodOrchestrator: PeriodOrchestrator,
): (date: string | Date, hour: number) => boolean {
  return (date: string | Date, hour: number) => {
    const updatedDate = setDateHour(new Date(date), hour);
    const period = generateNewPeriod(updatedDate);
    return periodOrchestrator.errors.some(isSamePeriod(period));
  };
}

export function isPeriodIncludedByAnother(
  period: IProvidePeriod,
): (value: IProvidePeriod) => boolean {
  return (anotherPeriod) =>
    anotherPeriod.start.getTime() <= period.start.getTime() &&
    anotherPeriod.end.getTime() >= period.end.getTime();
}
