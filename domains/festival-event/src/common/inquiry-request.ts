export const MAGASIN = "Magasin";
export const LIVRE_PAR_LOGISTIQUE = "Livré par l'équipe logistique";
export const LIVRE_PAR_TEAM_ELEC = "Livré par l'équipe élec";
export const LIVRE_PAR_BAR = "Livré par l'équipe bar";
export const LIVRE_PAR_COM = "Livré par une com";
export const BENNE_COLLETTE_BESSON = "Benne Collette Besson";
export const BENNE_PARKING_K_FET = "Benne Parking K-fet";
export const PARKING_EIFFEL = "Parking Eiffel";
export const CREUX_GCU = "Creux GCU";
export const CREUX_GM = "Creux GM";
export const CAVE_E = "Cave E";
export const CAVE_BIKERS = "Cave des Bikers";
export const CLUB_ROCK = "Club Rock";
export const CONTENUR_24H = "Conteneur 24h";
export const CONTENEUR_KARNA = "Conteneur Karna";
export const CONTENEUR_PARKING_K_FET = "Conteneur Parking K-fet";
export const CONTENEUR_SCENE_PULSE = "Conteneur Scène Pulse";
export const HALL_DES_HUMANITES = "Hall des Humanités";
export const LOCAL_24H = "Local 24h";
export const MDE = "MdE";
export const SALLE_MONTREAL = "Salle Montréal";
export const SALLE_RENE_CHAR = "Salle René Char";
export const NON_STOCKE = "Non stocké";
export const QG_ORGA = "QG Orga";
export const BACKLINE = "Backline";
export const SALLE_CRLA = "Salle CRL-A Humanités";
export const SALLE_CRLB = "Salle CRL-B Humanités";

export type Drive =
  | typeof MAGASIN
  | typeof LIVRE_PAR_LOGISTIQUE
  | typeof LIVRE_PAR_TEAM_ELEC
  | typeof LIVRE_PAR_BAR
  | typeof LIVRE_PAR_COM
  | typeof BENNE_COLLETTE_BESSON
  | typeof BENNE_PARKING_K_FET
  | typeof PARKING_EIFFEL
  | typeof CREUX_GCU
  | typeof CREUX_GM
  | typeof CAVE_E
  | typeof CAVE_BIKERS
  | typeof CLUB_ROCK
  | typeof CONTENUR_24H
  | typeof CONTENEUR_KARNA
  | typeof CONTENEUR_PARKING_K_FET
  | typeof CONTENEUR_SCENE_PULSE
  | typeof HALL_DES_HUMANITES
  | typeof LOCAL_24H
  | typeof MDE
  | typeof SALLE_MONTREAL
  | typeof SALLE_RENE_CHAR
  | typeof NON_STOCKE
  | typeof QG_ORGA
  | typeof BACKLINE
  | typeof SALLE_CRLA
  | typeof SALLE_CRLB;

export const drives: Drive[] = [
  MAGASIN,
  LIVRE_PAR_LOGISTIQUE,
  LIVRE_PAR_TEAM_ELEC,
  LIVRE_PAR_BAR,
  LIVRE_PAR_COM,
  BENNE_COLLETTE_BESSON,
  BENNE_PARKING_K_FET,
  PARKING_EIFFEL,
  CREUX_GCU,
  CREUX_GM,
  CAVE_E,
  CAVE_BIKERS,
  CLUB_ROCK,
  CONTENUR_24H,
  CONTENEUR_KARNA,
  CONTENEUR_PARKING_K_FET,
  CONTENEUR_SCENE_PULSE,
  HALL_DES_HUMANITES,
  LOCAL_24H,
  MDE,
  SALLE_MONTREAL,
  SALLE_RENE_CHAR,
  NON_STOCKE,
  QG_ORGA,
  BACKLINE,
  SALLE_CRLA,
  SALLE_CRLB,
];

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

export function isAssignedToDrive(
  request: InquiryRequest,
): request is InquiryRequestAssigned {
  return Object.hasOwn(request, "drive");
}

export type AssignDrive = {
  slug: string;
  drive: Drive;
};
