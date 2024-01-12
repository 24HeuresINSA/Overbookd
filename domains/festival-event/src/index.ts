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
  KeyEvent,
} from "./festival-activity/festival-activity";
export {
  DRAFT,
  IN_REVIEW,
  VALIDATED,
  REFUSED,
  isDraft,
  isRefused,
  READY_TO_REVIEW,
  COMMENTED,
  CREATED,
} from "./festival-activity/festival-activity";
export { FestivalActivityError } from "./festival-activity/festival-activity.error";

export type {
  Adherent,
  Contractor,
} from "./festival-activity/sections/in-charge";

// INQUIRY
export type {
  BaseInquiryRequest,
  InquiryWithPotentialRequests,
  InquiryWithRequests,
  InquiryRequestAssigned,
  InquiryRequest,
  InquiryOwner,
  WithInquiries,
  Drive,
} from "./festival-activity/sections/inquiry";
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
  drives,
  isAssignedToDrive,
} from "./festival-activity/sections/inquiry";

export type {
  ElectricitySupply,
  ElectricityConnection,
} from "./festival-activity/sections/supply";
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
} from "./festival-activity/sections/supply";

export type { Public as PublicGeneral } from "./festival-activity/sections/general";
export type {
  Signage,
  Location,
  SignageType,
  BaseSignage,
  SignageCatalogItem,
} from "./festival-activity/sections/signa";
export {
  BACHE,
  PANNEAU,
  AFFICHE,
  signageTypes,
  isLinkedToCatalogItem,
} from "./festival-activity/sections/signa";
export type { TimeWindow } from "./festival-activity/sections/time-window";

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
} from "./festival-activity/sections/reviews";
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
} from "./festival-activity/sections/reviews";

// CREATION
export { CreateFestivalActivity } from "./festival-activity/creation/creation";
export type {
  FestivalActivityCreationForm,
  CreateFestivalActivityRepository,
} from "./festival-activity/creation/creation";
export { InMemoryCreateFestivalActivityRepository } from "./festival-activity/creation/festival-activities.inmemory";
export { defaultDraft } from "./festival-activity/festival-activity.factory";

// PREPARATION
export { PrepareFestivalActivity } from "./festival-activity/preparation/prepare-festival-activity";
export type {
  PrepareFestivalActivityRepository,
  InitInquiry,
} from "./festival-activity/preparation/prepare-festival-activity";
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
  PrepareSecurityUpdate,
  LinkSignageCatalogItem,
} from "./festival-activity/preparation/prepare-festival-activity.model";

//ASK FOR REVIEW
export { InMemoryAskForReviewFestivalActivityRepository } from "./festival-activity/ask-for-review/festival-activities.inmemory";
export type {
  FestivalActivityWithoutStatus,
  InReviewWithoutStatus,
} from "./festival-activity/ask-for-review/in-review-festival-activity";
export { ReviewableSpecification } from "./festival-activity/ask-for-review/in-review-festival-activity";
export { AskForReview } from "./festival-activity/ask-for-review/ask-for-review";
export type {
  AskForReviewFestivalActivityRepository,
  Notifications,
  Notifyee,
} from "./festival-activity/ask-for-review/ask-for-review";

// Reviewing
export { Reviewing } from "./festival-activity/reviewing/reviewing";
export type { ReviewingFestivalActivities } from "./festival-activity/reviewing/reviewing";