import {
  GearRequest,
  GearRequestCreation,
  Period,
} from "../models/gearRequests";

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
    period.id === rentalPeriod.id || haveSamePeriodRange(period, rentalPeriod);
}

function haveSamePeriodRange(period: Period, otherPerid: Period): boolean {
  return (
    areSimilarDate(period.start, otherPerid.start) &&
    areSimilarDate(period.end, otherPerid.end)
  );
}

function areSimilarDate(date: Date, otherDate: Date): boolean {
  return date.getTime() === otherDate.getTime();
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

export function generateGearRequestCreationBuilder(
  gearId: number,
  quantity: number
): (period: Period) => GearRequestCreation {
  return (period: Period) => {
    const periodPart = isCreatedPeriod(period)
      ? { periodId: period.id }
      : { start: period.start, end: period.end };

    return {
      ...periodPart,
      gearId,
      quantity,
    };
  };
}

function isCreatedPeriod(period: Period): boolean {
  return period.id > 0;
}
