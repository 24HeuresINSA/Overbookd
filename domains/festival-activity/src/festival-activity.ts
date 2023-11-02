import { IProvidePeriod } from "@overbookd/period";

export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";

export type TimeWindow = IProvidePeriod & {
  id: string;
};

export type DraftGeneral = {
  name: string;
  description: string | null;
  categories: string[];
  toPublish: boolean;
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: TimeWindow[];
};

type General = Public | Private;

type Public = {
  name: string;
  description: string;
  categories: [string, ...string[]];
  toPublish: true;
  photoLink: string;
  isFlagship: boolean;
  timeWindows: [TimeWindow, ...TimeWindow[]];
};

type Private = {
  name: string;
  description: string;
  categories: [];
  toPublish: false;
  photoLink: null;
  isFlagship: false;
  timeWindows: TimeWindow[];
};

export type Adherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

type InCharge = {
  adherent: Adherent;
  team: string;
  contractors: never[];
};

export type DraftInCharge = Omit<InCharge, "team"> & {
  team: string | null;
};

export type Signage = {
  quantity: number;
  text: string;
  size: string;
  type: "BACHE" | "PANNEAU" | "AFFICHE";
  comment: string;
};

type Signa = {
  location: string;
  signages: Signage[];
};

export type DraftSigna = Omit<Signa, "location"> & {
  location: string | null;
};

export type Security = {
  specialNeed: string | null;
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

export type Supply = {
  electricity: ElectricitySupply[];
  water: string | null;
};

export type WithTimeWindows = {
  timeWindows: [TimeWindow, ...TimeWindow[]];
};

export type InquiryRequest = {
  id: number;
  quantity: number;
  name: string;
};

type WithGearInquiries = {
  barriers: InquiryRequest[];
  electricity: InquiryRequest[];
  gears: [InquiryRequest, ...InquiryRequest[]];
};

type WithBarriereInquiries = {
  barriers: [InquiryRequest, ...InquiryRequest[]];
  electricity: InquiryRequest[];
  gears: InquiryRequest[];
};

type WithElectricityInquiries = {
  barriers: InquiryRequest[];
  electricity: [InquiryRequest, ...InquiryRequest[]];
  gears: InquiryRequest[];
};

export type WithInquiries =
  | WithGearInquiries
  | WithBarriereInquiries
  | WithElectricityInquiries;

export type InquiryWithRequests = WithInquiries & WithTimeWindows;

export type InquiryWithPotentialRequests = {
  timeWindows: TimeWindow[];
  gears: InquiryRequest[];
  electricity: InquiryRequest[];
  barriers: InquiryRequest[];
};

export type Inquiry = InquiryWithPotentialRequests | InquiryWithRequests;

export type Draft = {
  id: number;
  status: typeof DRAFT;
  general: DraftGeneral;
  inCharge: DraftInCharge;
  signa: DraftSigna;
  security: Security;
  supply: Supply;
  inquiry: Inquiry;
};

export type InReview = {
  id: number;
  status: typeof IN_REVIEW;
  general: General;
  inCharge: InCharge;
  signa: Signa;
  security: Security;
  supply: Supply;
  inquiry: Inquiry;
};

export type FestivalActivity = Draft | InReview;

export type PreviewFestivalActivity = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  status: FestivalActivity["status"];
  adherent: FestivalActivity["inCharge"]["adherent"];
  team: FestivalActivity["inCharge"]["team"];
};

export type CreateFestivalActivityForm = {
  name: string;
};

export function isDraft(activity: FestivalActivity): activity is Draft {
  return activity.status === DRAFT;
}
