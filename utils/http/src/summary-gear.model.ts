import { FestivalActivity } from "@overbookd/festival-activity";

export interface SummaryGearPreview {
  id: number;
  name: string;
  slug: string;
  isConsumable: boolean;
  stockDiscrepancy: number;
}

export type ActivityInquiry = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  quantity: number;
};

export interface SummaryGearDetails {
  start: Date;
  end: Date;
  activities: ActivityInquiry[];
  inventory: number;
}
