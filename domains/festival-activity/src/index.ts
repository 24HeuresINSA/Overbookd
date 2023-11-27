export type {
  Draft,
  InReview,
  FestivalActivity,
  CreateFestivalActivityForm,
  PreviewFestivalActivity,
} from "./festival-activity";
export { DRAFT } from "./festival-activity";

export type { Adherent, Contractor } from "./sections/in-charge";

// INQUIRY
export type {
  BaseInquiryRequest,
  InquiryWithPotentialRequests,
  InquiryWithRequests,
  InquiryRequest,
  WithInquiries,
} from "./sections/inquiry";
export {
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
} from "./sections/inquiry";

export type { Public as PublicGeneral } from "./sections/general";
export type { Signage } from "./sections/signa";
export type { ElectricitySupply } from "./sections/supply";
export type { TimeWindow } from "./sections/time-window";

// REVIEWS
export type { ReviewStatus } from "./sections/reviews";
export { APPROVED, REVIEWING, NOT_ASKING_TO_REVIEW } from "./sections/reviews";

// CREATION
export { CreateFestivalActivity } from "./creation/creation";
export type {
  FestivalActivityCreationForm,
  CreateFestivalActivityRepository,
} from "./creation/creation";
export { InMemoryCreateFestivalActivityRepository } from "./creation/festival-activities.inmemory";

// PREPARATION
export { PrepareFestivalActivity } from "./preparation/prepare-festival-activity";
export type { PrepareFestivalActivityRepository } from "./preparation/prepare-festival-activity";
export type {
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
} from "./preparation/prepare-festival-activity.model";

//ASK FOR REVIEW
export { InMemoryAskForReviewFestivalActivityRepository } from "./ask-for-review/festival-activities.inmemory";
export type { Reviewer } from "./ask-for-review/waiting-for-review";
export {
  humain,
  comcom,
  signa,
  secu,
  matos,
  elec,
  barrieres,
} from "./ask-for-review/waiting-for-review";
