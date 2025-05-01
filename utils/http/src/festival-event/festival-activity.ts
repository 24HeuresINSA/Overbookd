import {
  BaseInquiryRequest,
  Drive,
  FestivalActivity,
  SignageCatalogItem,
  TimeWindow,
} from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/time";
import { AddInquiryRequestForm } from "./common.js";

export type PrepareInChargeForm = {
  adherentId?: number;
  team?: string;
};

export type PrepareSignaForm = {
  locationId: number | null;
};

export type InitInquiryRequest = {
  timeWindow: IProvidePeriod;
  request: AddInquiryRequestForm;
};

export type LinkSignageCatalogItemForm = {
  catalogItemId: SignageCatalogItem["id"];
};

export type PreviewForSecurity = {
  id: FestivalActivity["id"];
  status: FestivalActivity["status"];
  name: FestivalActivity["general"]["name"];
  team: FestivalActivity["inCharge"]["team"];
  timeWindows: TimeWindow[];
  specialNeeds: FestivalActivity["security"]["specialNeed"];
  freePass: FestivalActivity["security"]["freePass"];
};

export type ActivityGearInquiryForPreview = BaseInquiryRequest & {
  isPonctualUsage: boolean;
  isConsumable: boolean;
  category?: string;
  drive?: Drive;
  owner?: string;
};
export type PreviewForLogistic = {
  id: FestivalActivity["id"];
  status: FestivalActivity["status"];
  name: FestivalActivity["general"]["name"];
  team: FestivalActivity["inCharge"]["team"];
  inquiries: ActivityGearInquiryForPreview[];
};

export type PreviewForCommunication = {
  id: FestivalActivity["id"];
  status: FestivalActivity["status"];
  name: FestivalActivity["general"]["name"];
  timeWindows: FestivalActivity["general"]["timeWindows"];
  description: FestivalActivity["general"]["description"];
  photoLink: FestivalActivity["general"]["photoLink"];
  isFlagship: FestivalActivity["general"]["isFlagship"];
  categories: FestivalActivity["general"]["categories"];
};

export type ActivityGearSearchOptions = {
  search?: string;
  category?: string;
  owner?: string;
  drive?: string;
};
