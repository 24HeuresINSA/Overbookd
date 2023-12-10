import { TimeWindow } from "./time-window";

export const MATOS = "matos";
export const BARRIERES = "barrieres";
export const ELEC = "elec";

export type InquiryOwner = typeof MATOS | typeof BARRIERES | typeof ELEC;

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

export const drives: Drive[] = [
  BENNE_COLLETTE_BESSON,
  BENNE_PARKING_K_FET,
  PARKING_EIFFEL,
  CREUX_GCU,
  CREUX_GM,
  CAVE_E,
  CLUB_ROCK,
  CONTENUR_24H,
  CONTENEUR_KARNA,
  CONTENEUR_PARKING_K_FET,
  CONTENEUR_SCENE_ROOTS,
  HALL_DES_HUMANITES,
  LOCAL_24H,
  MAGASIN,
  MDE,
  SALLE_MONTREAL,
  SALLE_RENE_CHAR,
  NON_STOCKE,
  QG_ORGA,
  BACKLINE,
  LIVRE_PAR_LOGISTIQUE,
  LIVRE_PAR_COM,
];

export type WithTimeWindows = {
  timeWindows: [TimeWindow, ...TimeWindow[]];
};

export type BaseInquiryRequest = {
  slug: string;
  quantity: number;
  name: string;
};

type WithDrive = {
  drive: Drive;
};

export type InquiryRequestAssigned = BaseInquiryRequest & WithDrive;

export type InquiryRequest = BaseInquiryRequest | InquiryRequestAssigned;

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

export type Inquiry = InquiryWithPotentialRequests | InquiryWithRequests;
