import { FestivalActivity, FestivalTask } from "@overbookd/festival-event";

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

export type BaseGearDetails = {
  start: Date;
  end: Date;
  inquiry: number;
  stock: number;
  activities: Inquiry[];
  tasks: Inquiry[];
  inventory: number;
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
