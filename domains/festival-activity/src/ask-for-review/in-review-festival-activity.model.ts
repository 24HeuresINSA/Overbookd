import { IProvidePeriod } from "@overbookd/period";
import { IN_REVIEW, Inquiry, InquirySection } from "../festival-activity.core";
import {
  BaseFestivalActivity,
  GeneralSection,
  InChargeSection,
  SignaSection,
} from "../creation/draft-festival-activity.model";

type InReviewPrivateGeneralSection = GeneralSection & {
  name: string;
  description: string;
  toPublish: false;
  categories: string[];
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: IProvidePeriod[];
};

type InReviewPublicGeneralSection = GeneralSection & {
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

export type InReviewWithTimeWindowsInquirySection = InquirySection & {
  timeWindows: [IProvidePeriod, ...IProvidePeriod[]];
};

type WithGearsInquirySection = InquirySection & {
  gears: [Inquiry, ...Inquiry[]];
};

type WithBarriersInquirySection = InquirySection & {
  barrieres: [Inquiry, ...Inquiry[]];
};

type WithElectricityInquirySection = InquirySection & {
  electricity: [Inquiry, ...Inquiry[]];
};

export type InReviewWithRequestInquirySection =
  | WithGearsInquirySection
  | WithBarriersInquirySection
  | WithElectricityInquirySection;

export type InReviewInquirySection =
  | InquirySection
  | (InReviewWithRequestInquirySection & InReviewWithTimeWindowsInquirySection);

export type InReviewFestivalActivityRepresentation = BaseFestivalActivity & {
  status: typeof IN_REVIEW;
  general: InReviewGeneralSection;
  inCharge: InReviewInChargeSection;
  signa: InReviewSignaSection;
  inquiry: InReviewInquirySection;
};
