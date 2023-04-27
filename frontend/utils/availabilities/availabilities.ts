import { PeriodOrchestrator } from "~/domain/volunteer-availability/period-orchestrator";
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
): (date: string | Date) => boolean {
  return (date: string | Date) =>
    selectedAvailabilities.some(isDateIncludedByPeriod(new Date(date))) &&
    !isAvailabilityPeriodSaved(savedAvailabilities)(date);
}

export function isAvailabilityPeriodSaved(
  savedAvailabilities: Period[]
): (date: string | Date) => boolean {
  return (date: string | Date) => {
    return savedAvailabilities.some(isDateIncludedByPeriod(new Date(date)));
  };
}

export function hasAvailabilityPeriodError(
  periodOrchestrator: PeriodOrchestrator
): (date: string | Date) => boolean {
  return (date: string | Date) => {
    const period = generateNewPeriod(new Date(date));
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
