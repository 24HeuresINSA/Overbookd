export type {
  Draft,
  Reviewable,
  InReview,
  Validated,
  Refused,
  FestivalActivity,
  CreateFestivalActivityForm,
  PreviewDraft,
  PreviewReviewable,
  PreviewFestivalActivity,
  Feedback,
} from "./festival-activity";
export {
  DRAFT,
  IN_REVIEW,
  VALIDATED,
  REFUSED,
  isDraft,
} from "./festival-activity";
export { FestivalActivityError } from "./festival-activity.error";
export type {
  Created,
  ReadyToReview,
  Approved,
  Rejected,
} from "./festival-activity.event";

export type { Adherent, Contractor } from "./sections/in-charge";

// INQUIRY
export type {
  BaseInquiryRequest,
  InquiryWithPotentialRequests,
  InquiryWithRequests,
  InquiryRequest,
  InquiryOwner,
  WithInquiries,
  Drive,
} from "./sections/inquiry";
export {
  MATOS,
  BARRIERES,
  ELEC,
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

export type {
  ElectricitySupply,
  ElectricityConnection,
} from "./sections/supply";
export {
  PC16_Prise_classique,
  P17_16A_MONO,
  P17_16A_TRI,
  P17_16A_TETRA,
  P17_32A_MONO,
  P17_32A_TRI,
  P17_32A_TETRA,
  P17_63A_MONO,
  P17_63A_TRI,
  P17_63A_TETRA,
  P17_125A_TETRA,
} from "./sections/supply";

export type { Public as PublicGeneral } from "./sections/general";
export type { Signage, Location, SignageType } from "./sections/signa";
export { BACHE, PANNEAU, AFFICHE, signageTypes } from "./sections/signa";
export type { TimeWindow } from "./sections/time-window";

// REVIEWS
export type {
  ReviewStatus,
  Reviewer,
  WaitingForReview,
  InReviewReviews,
  ValidatedReviews,
  RefusedReviews,
  ApprovalReviewStatus,
  RejectionReviewStatus,
  ReviewingStatus,
} from "./sections/reviews";
export {
  APPROVED,
  REVIEWING,
  REJECTED,
  NOT_ASKING_TO_REVIEW,
  humain,
  communication,
  signa,
  secu,
  matos,
  elec,
  barrieres,
  isValidatedReviews,
  isRefusedReviews,
} from "./sections/reviews";

// CREATION
export { CreateFestivalActivity } from "./creation/creation";
export type {
  FestivalActivityCreationForm,
  CreateFestivalActivityRepository,
} from "./creation/creation";
export { InMemoryCreateFestivalActivityRepository } from "./creation/festival-activities.inmemory";
export { defaultDraft } from "./festival-activity.factory";

// PREPARATION
export { PrepareFestivalActivity } from "./preparation/prepare-festival-activity";
export type {
  PrepareFestivalActivityRepository,
  InitInquiry,
} from "./preparation/prepare-festival-activity";
export type {
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
  PrepareSignageCreation,
  PrepareFeedbackPublish,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareSignageUpdate,
  PrepareContractorCreation,
  PrepareContractorUpdate,
  PrepareInquiryRequestCreation,
} from "./preparation/prepare-festival-activity.model";

//ASK FOR REVIEW
export { InMemoryAskForReviewFestivalActivityRepository } from "./ask-for-review/festival-activities.inmemory";
export type {
  FestivalActivityWithoutStatus,
  InReviewWithoutStatus,
} from "./ask-for-review/in-review-festival-activity";
export { ReviewableSpecification } from "./ask-for-review/in-review-festival-activity";
export { AskForReview } from "./ask-for-review/ask-for-review";
export type {
  AskForReviewFestivalActivityRepository,
  Notifications,
  Notifyee,
} from "./ask-for-review/ask-for-review";

// Reviewing
export { Reviewing } from "./reviewing/reviewing";
export type { ReviewingFestivalActivities } from "./reviewing/reviewing";
