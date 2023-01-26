import { HttpStringified } from "../types/http";
import { Gear } from "./catalog.model";

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

export interface Period {
  id: number;
  start: Date;
  end: Date;
}

export interface Seeker<T extends "FA" | "FT"> {
  type: T;
  id: number;
  name: string;
}

export type EventSeeker = Seeker<"FA"> | Seeker<"FT">;

export interface GearRequest<T extends "FA" | "FT"> {
  rentalPeriod: Period;
  quantity: number;
  gear: Gear;
  seeker: Seeker<T>;
}

export interface StoredGearRequest<T extends "FA" | "FT">
  extends GearRequest<T> {
  drive?: string;
}

export interface GearRequestWithDrive<T extends "FA" | "FT">
  extends GearRequest<T> {
  drive: string;
}

export type EventGearRequest =
  | GearRequestWithDrive<"FA">
  | GearRequestWithDrive<"FT">;

export function castGearRequestWithDate(
  gearRequest: HttpStringified<StoredGearRequest<"FA" | "FT">>
): StoredGearRequest<"FA" | "FT"> {
  return {
    ...gearRequest,
    rentalPeriod: {
      ...gearRequest.rentalPeriod,
      start: new Date(gearRequest.rentalPeriod.start),
      end: new Date(gearRequest.rentalPeriod.end),
    },
  };
}
