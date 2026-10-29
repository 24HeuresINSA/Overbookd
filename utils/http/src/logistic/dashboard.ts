import { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import { Borrow, GearSearchOptions } from "@overbookd/logistic";
import { IProvidePeriod } from "@overbookd/time";

export type GearDashboardSearchOptions = GearSearchOptions & IProvidePeriod;

export type GearPreview = {
  id: number;
  name: string;
  slug: string;
  isConsumable: boolean;
  stockDiscrepancy: number;
};

export type Inquiry = {
  id: FestivalActivity["id"] | FestivalTask["id"];
  name: FestivalActivity["general"]["name"] | FestivalTask["general"]["name"];
  quantity: number;
};

export type GearBorrow = {
  id: Borrow["id"];
  lender: Borrow["lender"];
  quantity: number;
};

export type BaseGearDetails = {
  start: Date;
  end: Date;
  inquiry: number;
  stock: number;
  activities: Inquiry[];
  tasks: Inquiry[];
  inventory: number;
  borrows: GearBorrow[];
};

export type ConsumableGearDetails = BaseGearDetails & {
  consumed: number;
};

export type GearDetails = BaseGearDetails | ConsumableGearDetails;

export type GearWithDetails = {
  name: string;
  slug: string;
  details: GearDetails[];
};
