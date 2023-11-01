import {
  SecuritySection,
  SupplySection,
  InChargeSection,
  SignaSection,
} from "../festival-activity.core";
import { InquirySectionWithoutRequest, DRAFT } from "../festival-activity.core";
import { DraftGeneralSectionRepresentation } from "./draft-general-section";

export type DraftFestivalActivityBuilder = {
  id: number;
  general: DraftGeneralSectionRepresentation;
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

export type DraftInChargeSection = Omit<InChargeSection, "team"> & {
  team: string | null;
};

export type DraftSignaSection = Omit<SignaSection, "location"> & {
  location: string | null;
};

export type DraftSecuritySection = SecuritySection;

export type DraftSupplySection = SupplySection;

export type DraftInquirySection = InquirySectionWithoutRequest;
