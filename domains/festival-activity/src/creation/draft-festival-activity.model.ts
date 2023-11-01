import {
  SecuritySection,
  SupplySection,
  InChargeSection,
  SignaSection,
  TimeWindow,
} from "../festival-activity.core";
import {
  InquirySectionWithPotentialRequests,
  DRAFT,
} from "../festival-activity.core";

export type DraftFestivalActivityBuilder = {
  id: number;
  general: DraftGeneralSection;
  inCharge: DraftInChargeSection;
  signa: DraftSignaSection;
  security: DraftSecuritySection;
  supply: DraftSupplySection;
  inquiry: DraftInquirySection;
};

export type DraftFestivalActivityRepresentation =
  DraftFestivalActivityBuilder & {
    status: typeof DRAFT;
  };

export type DraftGeneralSection = {
  name: string;
  description: string | null;
  categories: string[];
  toPublish: boolean;
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: TimeWindow[];
};

export type DraftInChargeSection = Omit<InChargeSection, "team"> & {
  team: string | null;
};

export type DraftSignaSection = Omit<SignaSection, "location"> & {
  location: string | null;
};

export type DraftSecuritySection = SecuritySection;

export type DraftSupplySection = SupplySection;

export type DraftInquirySection = InquirySectionWithPotentialRequests;
