import { FestivalActivity } from "@overbookd/festival-event";

export type GearPreview = {
  id: number;
  name: string;
  slug: string;
  isConsumable: boolean;
  stockDiscrepancy: number;
};

export type ActivityInquiry = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  quantity: number;
};

export type GearDetails = {
  start: Date;
  end: Date;
  inquiry: number;
  stock: number;
  activities: ActivityInquiry[];
  inventory: number;
};
