import { IProvidePeriod } from "@overbookd/period";

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
  categories: string[];
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
  id: number;
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

export const BACHE = "BACHE";
export const PANNEAU = "PANNEAU";
export const AFFICHE = "AFFICHE";

export type SignageType = typeof BACHE | typeof PANNEAU | typeof AFFICHE;

export type Signage = {
  id: string;
  quantity: number;
  text: string;
  size: string;
  type: SignageType;
  comment: string | null;
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

export const PC16_Prise_classique = "PC16_Prise_classique";
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

export type Supply = {
  electricity: ElectricitySupply[];
  water: string | null;
};

export type WithTimeWindows = {
  timeWindows: [TimeWindow, ...TimeWindow[]];
};

type BaseInquiryRequest = {
  slug: string;
  quantity: number;
  name: string;
};

export const BENNE_COLLETTE_BESSON = "Benne Collette Besson";
export const BENNE_PARKING_K_FET = "Benne Parking K-fet";
export const PARKING_EIFFEL = "Parking Eiffel";
export const CREUX_GCU = "Creux GCU";
export const CREUX_GM = "Creux GM";
export const CAVE_E = "Cave E";
export const CLUB_ROCK = "Club Rock";
export const CONTENUR_24H = "Conteneur 24h";
export const CONTENEUR_KARNA = "Conteneur Karna";
export const CONTENEUR_PARKING_K_FET = "Conteneur Parking K-fet";
export const CONTENEUR_SCENE_ROOTS = "Conteneur Scène Roots";
export const HALL_DES_HUMANITES = "Hall des Humanités";
export const LOCAL_24H = "Local 24h";
export const MAGASIN = "Magasin";
export const MDE = "MdE";
export const SALLE_MONTREAL = "Salle Montréal";
export const SALLE_RENE_CHAR = "Salle René Char";
export const NON_STOCKE = "Non stocké";
export const QG_ORGA = "QG Orga";
export const BACKLINE = "Backline";
export const LIVRE_PAR_LOGISTIQUE = "Livré par l'équipe logistique";
export const LIVRE_PAR_COM = "Livré par une com";

export type Drive =
  | typeof BENNE_COLLETTE_BESSON
  | typeof BENNE_PARKING_K_FET
  | typeof PARKING_EIFFEL
  | typeof CREUX_GCU
  | typeof CREUX_GM
  | typeof CAVE_E
  | typeof CLUB_ROCK
  | typeof CONTENUR_24H
  | typeof CONTENEUR_KARNA
  | typeof CONTENEUR_PARKING_K_FET
  | typeof CONTENEUR_SCENE_ROOTS
  | typeof HALL_DES_HUMANITES
  | typeof LOCAL_24H
  | typeof MAGASIN
  | typeof MDE
  | typeof SALLE_MONTREAL
  | typeof SALLE_RENE_CHAR
  | typeof NON_STOCKE
  | typeof QG_ORGA
  | typeof BACKLINE
  | typeof LIVRE_PAR_LOGISTIQUE
  | typeof LIVRE_PAR_COM;

type WithDrive = {
  drive: Drive;
};

export type InquiryRequest =
  | BaseInquiryRequest
  | (BaseInquiryRequest & WithDrive);

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
export const APPROVED = "APPROVED";

export const comcom = "comcom";
export const humain = "humain";
export const signa = "signa";
export const secu = "secu";
export const matos = "matos";
export const elec = "elec";
export const barrieres = "barrieres";

export type PrivateActivityReviewer =
  | typeof humain
  | typeof signa
  | typeof secu
  | typeof matos
  | typeof elec
  | typeof barrieres;

export type PublicActivityReviewer = PrivateActivityReviewer | typeof comcom;

export type Reviewer = PublicActivityReviewer | PrivateActivityReviewer;

export type WaitingForReview = {
  id: number;
  name: string;
  reviewers: Reviewer[];
};

export type ReviewStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof APPROVED;

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
