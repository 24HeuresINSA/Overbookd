import {
  FestivalActivity,
  PrepareInquiryRequestCreation,
  Reviewer,
  Signage,
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
  activityId: FestivalActivity["id"];
  signageId: Signage["id"];
  catalogItemId: number;
};
