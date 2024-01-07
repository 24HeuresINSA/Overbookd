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
  activities: ActivityInquiry[];
  inventory: number;
};

type WithDetails = {
  details: DashboardGearDetails;
};

export type DashboardGearForGraph = WithDetails & {
  start: Date;
  end: Date;
  inquiry: number;
  stock: number;
};
