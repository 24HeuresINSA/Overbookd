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

export type GearDetails = {
  start: Date;
  end: Date;
  inquiry: number;
  stock: number;
  activities: Inquiry[];
  tasks: Inquiry[];
  inventory: number;
  stockDiscrepancy: number;
};

export type GearWithDetails = {
  name: string;
  slug: string;
  details: GearDetails[];
};
