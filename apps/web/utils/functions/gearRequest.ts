import { IProvidePeriod } from "@overbookd/period";
import { updateItemToList } from "@overbookd/list";
import { isSamePeriod } from "../availabilities/period";
import {
  GearRequest,
  GearRequestCreation,
  GearRequestSortFunction,
  Period,
  Seeker,
  SortableGearRequestHeader,
  StoredGearRequest,
} from "../models/gearRequests";

export function uniqueGearRequestPeriodsReducer(
  gearRequests: GearRequest<"FA" | "FT">[]
): Period[] {
  const rentalPeriods = gearRequests
    .filter(({ gear }) => !gear.isConsumable)
    .map(({ rentalPeriod }) => rentalPeriod);
  return uniquePeriodsReducer(rentalPeriods);
}

export function uniquePeriodsReducer(rentalPeriods: Period[]): Period[] {
  return rentalPeriods.reduce((periods, rentalPeriod) => {
    const similarPeriodIndex = periods.findIndex(isSimilarPeriod(rentalPeriod));
    if (similarPeriodIndex === -1) return [...periods, rentalPeriod];
    const similarPeriod = periods.at(similarPeriodIndex);
    if (!similarPeriod) return [...periods, rentalPeriod];
    const mergedPeriod = {
      id: similarPeriod.id,
      start: new Date(
        Math.min(rentalPeriod.start.getTime(), similarPeriod.start.getTime())
      ),
      end: new Date(
        Math.max(rentalPeriod.end.getTime(), similarPeriod.end.getTime())
      ),
    };
    return uniquePeriodsReducer(
      updateItemToList(periods, similarPeriodIndex, mergedPeriod)
    );
  }, [] as Period[]);
}

export function isSimilarPeriod(
  rentalPeriod: Period
): (value: Period) => boolean {
  return (period) =>
    period.id === rentalPeriod.id || isOverlappingPeriod(period)(rentalPeriod);
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

export function uniqueByGearReducer<T extends "FA" | "FT">(
  gearRequests: StoredGearRequest<T>[],
  gearRequest: StoredGearRequest<T>
): StoredGearRequest<T>[] {
  const savedGearRequest = gearRequests.find(
    (gr) => gr.gear.id === gearRequest.gear.id
  );
  if (savedGearRequest) return gearRequests;
  return [...gearRequests, gearRequest];
}

export function isSameGearRequest<T extends "FA" | "FT">(
  gearRequest: StoredGearRequest<T>
): (value: StoredGearRequest<T>) => boolean {
  return (gr: StoredGearRequest<T>) => {
    return (
      gearRequest.gear.id === gr.gear.id &&
      gearRequest.rentalPeriod.id === gr.rentalPeriod.id &&
      gearRequest.seeker.id === gr.seeker.id &&
      gearRequest.seeker.type === gr.seeker.type
    );
  };
}

export function isSimilarGearRequest<T extends "FA" | "FT">(
  gearRequest: StoredGearRequest<T>
): (value: StoredGearRequest<T>) => boolean {
  return (gr: StoredGearRequest<T>) => {
    const isSameGear = gearRequest.gear.id === gr.gear.id;
    const isSameSeeker = isSameGearRequestSeeker(gearRequest.seeker)(gr.seeker);
    const isSimilarPeriod = isOverlappingPeriod(gearRequest.rentalPeriod)(
      gr.rentalPeriod
    );
    return (
      (isSameGear && isSameSeeker && isSimilarPeriod) ||
      isSimilarConsumableGearRequest(gearRequest)(gr)
    );
  };
}

function isSameGearRequestSeeker<T extends "FA" | "FT">(
  seeker: Seeker<T>
): (value: Seeker<T>) => boolean {
  return (s: Seeker<T>) => seeker.id === s.id && seeker.type === s.type;
}

function isOverlappingPeriod(
  period: IProvidePeriod
): (value: IProvidePeriod) => boolean {
  return (p: IProvidePeriod) =>
    period.start.getTime() <= p.end.getTime() &&
    period.end.getTime() >= p.start.getTime();
}

export function isSimilarConsumableGearRequest<T extends "FA" | "FT">(
  gearRequest: StoredGearRequest<T>
): (value: StoredGearRequest<T>) => boolean {
  return (gr: StoredGearRequest<T>) => {
    return (
      gearRequest.gear.id === gr.gear.id &&
      gearRequest.seeker.id === gr.seeker.id &&
      gearRequest.seeker.type === gr.seeker.type &&
      gr.gear.isConsumable
    );
  };
}

export function splitGearRequest<T extends "FA" | "FT">(
  gearRequest: GearRequest<T>,
  toRemovePeriod: IProvidePeriod,
  availablePeriods: IProvidePeriod[]
): GearRequest<T>[] {
  const remainingPeriods = availablePeriods.filter(
    (period) => !isSamePeriod(toRemovePeriod)(period)
  );
  if (gearRequest.gear.isConsumable) {
    const start = new Date(
      Math.min(...remainingPeriods.map(({ start }) => start.getTime()))
    );
    const end = new Date(
      Math.max(...remainingPeriods.map(({ end }) => end.getTime()))
    );
    return [{ ...gearRequest, rentalPeriod: { id: -1, start, end } }];
  }
  const mergedPeriods = uniquePeriodsReducer(
    remainingPeriods.map((period, index) => ({
      ...period,
      id: -1 * (index + 1),
    }))
  );
  return mergedPeriods.map((rentalPeriod) => ({
    ...gearRequest,
    rentalPeriod,
  }));
}

function sortOnQuantity(gearRequests: GearRequest[], desc: boolean) {
  const order = desc ? -1 : 1;
  return gearRequests.sort((a, b) => (a.quantity - b.quantity) * order);
}

function sortOnGear(gearRequests: GearRequest[], desc: boolean) {
  const order = desc ? -1 : 1;
  return gearRequests.sort(
    (a, b) => a.gear.name.localeCompare(b.gear.name) * order
  );
}

function sortOnRentalPeriodStart(gearRequests: GearRequest[], desc: boolean) {
  const order = desc ? -1 : 1;
  return gearRequests.sort(
    (a, b) =>
      (a.rentalPeriod.start.getTime() - b.rentalPeriod.start.getTime()) * order
  );
}

function sortOnRentalPeriodEnd(gearRequests: GearRequest[], desc: boolean) {
  const order = desc ? -1 : 1;
  return gearRequests.sort(
    (a, b) =>
      (a.rentalPeriod.end.getTime() - b.rentalPeriod.end.getTime()) * order
  );
}

export const gearRequestsSorts = new Map<
  SortableGearRequestHeader,
  GearRequestSortFunction
>([
  ["quantity", sortOnQuantity],
  ["gear", sortOnGear],
  ["startDate", sortOnRentalPeriodStart],
  ["endDate", sortOnRentalPeriodEnd],
]);
