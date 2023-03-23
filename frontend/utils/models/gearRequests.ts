import { HttpStringified } from "../types/http";
import { Gear } from "./catalog.model";
import { Period as GeneralPeriod } from "./period";

export interface BaseGearRequestCreation {
  gearId: number;
  quantity: number;
}

export interface ExistingPeriodGearRequestCreation
  extends BaseGearRequestCreation {
  periodId: number;
}

export interface NewPeriodGearRequestCreation extends BaseGearRequestCreation {
  start: Date;
  end: Date;
}

export type GearRequestCreation =
  | NewPeriodGearRequestCreation
  | ExistingPeriodGearRequestCreation;

export type GearRequestUpdate = Partial<
  Omit<NewPeriodGearRequestCreation, "gearId">
>;

export interface Period extends GeneralPeriod {
  id: number;
}

export interface Seeker<T extends "FA" | "FT" = "FA" | "FT"> {
  type: T;
  id: number;
  name: string;
}

export type EventSeeker = Seeker<"FA"> | Seeker<"FT">;

export interface GearRequest<T extends "FA" | "FT" = "FA" | "FT"> {
  rentalPeriod: Period;
  quantity: number;
  gear: Gear;
  seeker: Seeker<T>;
}

export interface StoredGearRequest<T extends "FA" | "FT" = "FA" | "FT">
  extends GearRequest<T> {
  drive?: string;
}

export function isFAStoredGearRequest(
  storedGearRequest: StoredGearRequest
): storedGearRequest is StoredGearRequest<"FA"> {
  return storedGearRequest.seeker.type === "FA";
}

export function isFTStoredGearRequest(
  storedGearRequest: StoredGearRequest
): storedGearRequest is StoredGearRequest<"FT"> {
  return storedGearRequest.seeker.type === "FT";
}

export interface GearRequestWithDrive<T extends "FA" | "FT" = "FA" | "FT">
  extends GearRequest<T> {
  drive: string;
}

export type EventGearRequest =
  | GearRequestWithDrive<"FA">
  | GearRequestWithDrive<"FT">;

export function castGearRequestWithDate(
  gearRequest: HttpStringified<StoredGearRequest>
): StoredGearRequest {
  return {
    ...gearRequest,
    rentalPeriod: {
      ...gearRequest.rentalPeriod,
      start: new Date(gearRequest.rentalPeriod.start),
      end: new Date(gearRequest.rentalPeriod.end),
    },
  };
}

export type sortableGearRequestHeader =
  | "quantity"
  | "gear"
  | "startDate"
  | "endDate";

export type gearRequestSortFunction = (
  gearRequests: GearRequest[],
  desc: boolean
) => GearRequest[];
