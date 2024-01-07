import { FestivalActivity } from "@overbookd/festival-activity";

export type DashboardGearPreview = {
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

export type DashboardGearDetails = {
  start: Date;
  end: Date;
  inquiry: number;
  stock: number;
  activities: ActivityInquiry[];
  inventory: number;
};
