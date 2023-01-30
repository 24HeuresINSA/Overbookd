import { GearRequest, Period } from "../models/gearRequests";

export function uniqueGerRequestPeriodsReducer(
  gearRequests: GearRequest<"FA" | "FT">[]
): Period[] {
  const rentalPeriods = gearRequests.map(({ rentalPeriod }) => rentalPeriod);
  return uniquePeriodsReducer(rentalPeriods);
}

export function uniquePeriodsReducer(rentalPeriods: Period[]): Period[] {
  return rentalPeriods.reduce((periods, rentalPeriod) => {
    const period = periods.find(isSimilarPeriod(rentalPeriod));
    if (period) return periods;
    return [...periods, rentalPeriod];
  }, [] as Period[]);
}

function isSimilarPeriod(rentalPeriod: Period): (value: Period) => boolean {
  return (period) =>
    period.id === rentalPeriod.id ||
    (period.start === rentalPeriod.start && period.end === rentalPeriod.end);
}

export function uniqueGearReducer<T extends "FA" | "FT">(
  gearRequests: GearRequest<T>[],
  gearRequest: GearRequest<T>
): GearRequest<T>[] {
  const existingGearRequest = gearRequests.find(
    (gr) => gr.gear.id === gearRequest.gear.id
  );
  if (existingGearRequest) return gearRequests;
  return [...gearRequests, gearRequest];
}
