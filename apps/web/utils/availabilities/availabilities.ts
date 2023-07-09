import { PeriodOrchestrator } from "~/domain/volunteer-availability/period-orchestrator";
import { setDateHour } from "../date/dateUtils";
import { Period } from "../models/period";
import { isPartyShift } from "../shift/shift";
import {
  generateNewPeriod,
  isDateIncludedByPeriod,
  isSamePeriod,
} from "./period";

export function isEndOfAvailabilityPeriod(hour: number): boolean {
  return isPartyShift(hour) || hour % 2 === 0;
}

export function isAvailabilityPeriodSelected(
  selectedAvailabilities: Period[],
  savedAvailabilities: Period[]
): (date: string | Date, hour: number) => boolean {
  return (date: string | Date, hour: number) =>
    selectedAvailabilities.some(
      isDateIncludedByPeriod(setDateHour(new Date(date), hour))
    ) && !isAvailabilityPeriodSaved(savedAvailabilities)(date, hour);
}

export function isAvailabilityPeriodSaved(
  savedAvailabilities: Period[]
): (date: string | Date, hour: number) => boolean {
  return (date: string | Date, hour: number) => {
    const updatedDate = setDateHour(new Date(date), hour);
    return savedAvailabilities.some(isDateIncludedByPeriod(updatedDate));
  };
}

export function hasAvailabilityPeriodError(
  periodOrchestrator: PeriodOrchestrator
): (date: string | Date, hour: number) => boolean {
  return (date: string | Date, hour: number) => {
    const updatedDate = setDateHour(new Date(date), hour);
    const period = generateNewPeriod(updatedDate);
    return periodOrchestrator.errors.some(isSamePeriod(period));
  };
}

export function isPeriodIncludedByAnother(
  period: Period
): (value: Period) => boolean {
  return (anotherPeriod) =>
    anotherPeriod.start.getTime() <= period.start.getTime() &&
    anotherPeriod.end.getTime() >= period.end.getTime();
}
