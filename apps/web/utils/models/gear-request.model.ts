import { IProvidePeriod } from "@overbookd/period";
import { HttpStringified } from "@overbookd/http";
import { Gear } from "./catalog.model";

export type BaseGearRequestCreation = {
  gearId: number;
  quantity: number;
};

export type ExistingPeriodGearRequestCreation = BaseGearRequestCreation & {
  periodId: number;
};

export type NewPeriodGearRequestCreation = BaseGearRequestCreation & {
  start: Date;
  end: Date;
};

export type GearRequestCreation =
  | NewPeriodGearRequestCreation
  | ExistingPeriodGearRequestCreation;

export type GearRequestUpdate = Partial<
  Omit<NewPeriodGearRequestCreation, "gearId">
>;

export type Period = IProvidePeriod & {
  id: number;
};

export type Seeker<T extends "FA" | "FT" = "FA" | "FT"> = {
  type: T;
  id: number;
  name: string;
};

export type EventSeeker = Seeker<"FA"> | Seeker<"FT">;

export type GearRequest<T extends "FA" | "FT" = "FA" | "FT"> = {
  rentalPeriod: Period;
  quantity: number;
  gear: Gear;
  seeker: Seeker<T>;
};

export type StoredGearRequest<T extends "FA" | "FT" = "FA" | "FT"> =
  GearRequest<T> & {
    drive?: string;
  };

export function isFAStoredGearRequest(
  storedGearRequest: StoredGearRequest,
): storedGearRequest is StoredGearRequest<"FA"> {
  return storedGearRequest.seeker.type === "FA";
}

export function isFTStoredGearRequest(
  storedGearRequest: StoredGearRequest,
): storedGearRequest is StoredGearRequest<"FT"> {
  return storedGearRequest.seeker.type === "FT";
}

export type GearRequestWithDrive<T extends "FA" | "FT" = "FA" | "FT"> =
  GearRequest<T> & {
    drive: string;
  };

export type EventGearRequest =
  | GearRequestWithDrive<"FA">
  | GearRequestWithDrive<"FT">;

export function castGearRequestWithDate(
  gearRequest: HttpStringified<StoredGearRequest>,
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

export type SortableGearRequestHeader =
  | "quantity"
  | "gear"
  | "startDate"
  | "endDate";

export type GearRequestSortFunction = (
  gearRequests: GearRequest[],
  desc: boolean,
) => GearRequest[];
