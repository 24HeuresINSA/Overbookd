import { InquiryRequestAssigned } from "@overbookd/festival-event";
import {
  FestivalActivity,
  Reviewer,
  SignageCatalogItem,
  TimeWindow,
} from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/period";
import { AddInquiryRequestForm } from "./common.model";

export type PrepareInChargeForm = {
  adherentId?: number;
  team?: string;
};

export type PrepareSignaForm = {
  locationId: number | null;
};

export type ReviewRejection = {
  team: Reviewer<"FA">;
  reason: string;
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
  name: FestivalActivity["general"]["name"];
  team: FestivalActivity["inCharge"]["team"];
  timeWindows: TimeWindow[];
  specialNeeds: FestivalActivity["security"]["specialNeed"];
  freePass: FestivalActivity["security"]["freePass"];
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

export type LogisticInquiry = InquiryRequestAssigned & {
  gear: {
    id: number;
    isPonctualUsage: boolean;
    isConsumable: boolean;
    category: {
      name: string;
      path: string;
      id: number;
      owner: {
        name: string;
        code: string;
      };
    };
  };
};

export type PreviewForLogistic = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  status: FestivalActivity["status"];
  timeWindows: FestivalActivity["inquiry"]["timeWindows"];
  inquiries: LogisticInquiry[];
};
