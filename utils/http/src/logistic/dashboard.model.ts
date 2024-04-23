import { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import { Purchase } from "@overbookd/logistic";
import { Borrow } from "@overbookd/logistic";

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

export type GearPurchase = {
  id: Purchase["id"];
  seller: Purchase["seller"];
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
  purchases: GearPurchase[];
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
