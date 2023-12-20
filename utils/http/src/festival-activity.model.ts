import {
  FestivalActivity,
  PrepareInquiryRequestCreation,
  Reviewer,
  SignageCatalogItem,
  TimeWindow,
} from "@overbookd/festival-activity";
import { IProvidePeriod } from "@overbookd/period";

export type PrepareInChargeForm = {
  adherentId?: number;
  team?: string;
};

export type PrepareSignaForm = {
  locationId: number | null;
};

export type AddInquiryRequest = Pick<
  PrepareInquiryRequestCreation,
  "slug" | "quantity"
>;

export type ReviewRejection = {
  team: Reviewer;
  reason: string;
};

export type InitInquiryRequest = {
  timeWindow: IProvidePeriod;
  request: AddInquiryRequest;
};

export type LinkSignageCatalogItemForm = {
  catalogItemId: SignageCatalogItem["id"];
};

export type Statistics = {
  teamCode: string;
  status: Record<FestivalActivity["status"], number>;
  total: number;
};

export type PreviewForSecu = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  team: FestivalActivity["inCharge"]["team"];
  timeWindows: TimeWindow[];
  specialNeeds: FestivalActivity["security"]["specialNeed"];
  freePass: FestivalActivity["security"]["freePass"];
};
