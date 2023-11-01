import { IProvidePeriod } from "@overbookd/period";

export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";

export type Adherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

export type Signage = {
  quantity: number;
  text: string;
  size: string;
  type: "BACHE" | "PANNEAU" | "AFFICHE";
  comment: string;
};

export type ElectricitySupply = {
  connection:
    | "PC16_Prise_classique"
    | "P17_16A_MONO"
    | "P17_16A_TRI"
    | "P17_16A_TETRA"
    | "P17_32A_MONO"
    | "P17_32A_TRI"
    | "P17_32A_TETRA"
    | "P17_63A_MONO"
    | "P17_63A_TRI"
    | "P17_63A_TETRA"
    | "P17_125A_TETRA";
  device: string;
  power: number;
  count: number;
  comment: string | null;
};

export type Inquiry = {
  id: number;
  quantity: number;
  name: string;
};

export type InChargeSection = {
  adherent: Adherent;
  team: string;
  contractors: never[];
};

export type SignaSection = {
  location: string;
  signages: Signage[];
};

export type SecuritySection = {
  specialNeed: string | null;
};

export type SupplySection = {
  electricity: ElectricitySupply[];
  water: string | null;
};

export type PrivateGeneralSection = {
  name: string;
  description: string;
  toPublish: false;
  categories: string[];
  photoLink: null;
  isFlagship: false;
  timeWindows: TimeWindow[];
};

export type PublicGeneralSection = {
  name: string;
  description: string;
  toPublish: true;
  categories: [string, ...string[]];
  photoLink: string;
  isFlagship: boolean;
  timeWindows: [TimeWindow, ...TimeWindow[]];
};

export type GeneralSection = PrivateGeneralSection | PublicGeneralSection;

export type InquiryWithTimeWindows = {
  timeWindows: [TimeWindow, ...TimeWindow[]];
};

type InquiryWithGears = {
  barriers: Inquiry[];
  electricity: Inquiry[];
  gears: [Inquiry, ...Inquiry[]];
};

type InquiryWithBarriers = {
  barriers: [Inquiry, ...Inquiry[]];
  electricity: Inquiry[];
  gears: Inquiry[];
};

type InquiryWithElectricity = {
  barriers: Inquiry[];
  electricity: [Inquiry, ...Inquiry[]];
  gears: Inquiry[];
};

export type InquiryWithRequests =
  | InquiryWithGears
  | InquiryWithBarriers
  | InquiryWithElectricity;

export type InquirySectionWithRequests = InquiryWithRequests &
  InquiryWithTimeWindows;

export type InquirySectionWithPotentialRequests = {
  timeWindows: TimeWindow[];
  gears: Inquiry[];
  electricity: Inquiry[];
  barriers: Inquiry[];
};

export type InquirySection =
  | InquirySectionWithPotentialRequests
  | InquirySectionWithRequests;

export type TimeWindow = IProvidePeriod & {
  id: string;
};
