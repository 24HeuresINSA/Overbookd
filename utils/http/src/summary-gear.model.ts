import { FestivalActivity } from "@overbookd/festival-activity";

export type SummaryGearPreview = {
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

export type SummaryGearDetails = {
  activities: ActivityInquiry[];
  inventory: number;
};

type WithDetails = {
  details: SummaryGearDetails;
};

export type SummaryGearForGraph = WithDetails & {
  start: Date;
  end: Date;
  inquiry: number;
  stock: number;
};
