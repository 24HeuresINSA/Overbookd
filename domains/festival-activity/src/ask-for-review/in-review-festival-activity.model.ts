import { IProvidePeriod } from "@overbookd/period";
import {
  IN_REVIEW,
  InquiryRequest,
  InquirySection,
} from "../festival-activity.core";
import {
  InChargeSection,
  SecuritySection,
  SignaSection,
  SupplySection,
} from "../creation/draft-festival-activity.model";

export type InReviewPrivateGeneralSection = {
  name: string;
  description: string;
  toPublish: false;
  categories: string[];
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: IProvidePeriod[];
};

export type InReviewPublicGeneralSection = {
  name: string;
  description: string;
  toPublish: true;
  categories: [string, ...string[]];
  photoLink: string;
  isFlagship: boolean;
  timeWindows: [IProvidePeriod, ...IProvidePeriod[]];
};

export type InReviewGeneralSection =
  | InReviewPrivateGeneralSection
  | InReviewPublicGeneralSection;

export type InReviewInChargeSection = InChargeSection & {
  team: string;
};

export type InReviewSignaSection = SignaSection & {
  location: string;
};

export type InquiryWithTimeWindows = {
  timeWindows: [IProvidePeriod, ...IProvidePeriod[]];
};

type InquiryWithGears = {
  barriers: InquiryRequest[];
  electricity: InquiryRequest[];
  gears: [InquiryRequest, ...InquiryRequest[]];
};

type InquiryWithBarriers = {
  barriers: [InquiryRequest, ...InquiryRequest[]];
  electricity: InquiryRequest[];
  gears: InquiryRequest[];
};

type InquiryWithElectricity = {
  barriers: InquiryRequest[];
  electricity: [InquiryRequest, ...InquiryRequest[]];
  gears: InquiryRequest[];
};

export type InquiryWithRequests =
  | InquiryWithGears
  | InquiryWithBarriers
  | InquiryWithElectricity;

export type InReviewInquirySectionWithRequests = InquiryWithRequests &
  InquiryWithTimeWindows;

export type InReviewInquirySection =
  | InquirySection
  | InReviewInquirySectionWithRequests;

export type InReviewFestivalActivityRepresentation = {
  id: number;
  status: typeof IN_REVIEW;
  general: InReviewGeneralSection;
  inCharge: InReviewInChargeSection;
  security: SecuritySection;
  signa: InReviewSignaSection;
  supply: SupplySection;
  inquiry: InReviewInquirySection;
};
