import { IProvidePeriod } from "@overbookd/period";
import { Reviewer } from "./ask-for-review/waiting-for-review";

export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";

export type TimeWindow = IProvidePeriod & {
  id: string;
};

type DraftGeneral = {
  name: string;
  description: string | null;
  categories: string[];
  toPublish: boolean;
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: TimeWindow[];
};

type General = Public | Private;

export type Public = {
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

export type Contractor = {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string | null;
  company: string | null;
  comment: string | null;
};

type InCharge = {
  adherent: Adherent;
  team: string;
  contractors: Contractor[];
};

type DraftInCharge = Omit<InCharge, "team"> & {
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

type DraftSigna = Omit<Signa, "location"> & {
  location: string | null;
};

type Security = {
  specialNeed: string | null;
};

const PC16_Prise_classique = "PC16_Prise_classique";
export const P17_16A_MONO = "P17_16A_MONO";
const P17_16A_TRI = "P17_16A_TRI";
export const P17_16A_TETRA = "P17_16A_TETRA";
const P17_32A_MONO = "P17_32A_MONO";
const P17_32A_TRI = "P17_32A_TRI";
export const P17_32A_TETRA = "P17_32A_TETRA";
const P17_63A_MONO = "P17_63A_MONO";
const P17_63A_TRI = "P17_63A_TRI";
const P17_63A_TETRA = "P17_63A_TETRA";
const P17_125A_TETRA = "P17_125A_TETRA";

export type ElectricityConnection =
  | typeof PC16_Prise_classique
  | typeof P17_16A_MONO
  | typeof P17_16A_TRI
  | typeof P17_16A_TETRA
  | typeof P17_32A_MONO
  | typeof P17_32A_TRI
  | typeof P17_32A_TETRA
  | typeof P17_63A_MONO
  | typeof P17_63A_TRI
  | typeof P17_63A_TETRA
  | typeof P17_125A_TETRA;

export type ElectricitySupply = {
  id: string;
  connection: ElectricityConnection;
  device: string;
  power: number;
  count: number;
  comment: string | null;
};

type Supply = {
  electricity: ElectricitySupply[];
  water: string | null;
};

export type WithTimeWindows = {
  timeWindows: [TimeWindow, ...TimeWindow[]];
};

export type InquiryRequest = {
  id: string;
  quantity: number;
  slug: string;
};

type WithGearInquiries = {
  barriers: InquiryRequest[];
  electricity: InquiryRequest[];
  gears: [InquiryRequest, ...InquiryRequest[]];
};

type WithBarrierInquiries = {
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
  | WithBarrierInquiries
  | WithElectricityInquiries;

export type InquiryWithRequests = WithInquiries & WithTimeWindows;

export type InquiryWithPotentialRequests = {
  timeWindows: TimeWindow[];
  gears: InquiryRequest[];
  electricity: InquiryRequest[];
  barriers: InquiryRequest[];
};

type Inquiry = InquiryWithPotentialRequests | InquiryWithRequests;

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

export const REVIEWING = "REVIEWING";
export const NOT_ASKING_TO_REVIEW = "NOT_ASKING_TO_REVIEW";

export type ReviewStatus = typeof REVIEWING | typeof NOT_ASKING_TO_REVIEW;

type Reviews = Record<Reviewer, ReviewStatus>;

export type InReview = {
  id: number;
  status: typeof IN_REVIEW;
  general: General;
  inCharge: InCharge;
  signa: Signa;
  security: Security;
  supply: Supply;
  inquiry: Inquiry;
  reviews: Reviews;
};

export type FestivalActivity = Draft | InReview;

export type PreviewFestivalActivity = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  status: FestivalActivity["status"];
  adherent: FestivalActivity["inCharge"]["adherent"];
  team: FestivalActivity["inCharge"]["team"];
  reviews: Reviews;
};

export type CreateFestivalActivityForm = {
  name: string;
};

export function isDraft(activity: FestivalActivity): activity is Draft {
  return activity.status === DRAFT;
}
