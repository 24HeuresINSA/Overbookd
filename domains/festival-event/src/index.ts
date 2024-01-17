//  **********************
//  COMMON MODULE
//  **********************
export type { Feedback } from "./common/feedback";
export {
  CREATED,
  COMMENTED,
  READY_TO_REVIEW,
  APPROVED,
  REJECTED,
} from "./common/action";
export { DRAFT, IN_REVIEW, VALIDATED, REFUSED } from "./common/status";
export type { Adherent } from "./common/adherent";
export type {
  ReviewStatus,
  Reviewer,
  InReviewReviews,
  ValidatedReviews,
  RefusedReviews,
  ApprovalReviewStatus,
  RejectionReviewStatus,
  ReviewingStatus,
} from "./common/review";
export type { TimeWindow } from "./common/time-window";
export {
  REVIEWING,
  NOT_ASKING_TO_REVIEW,
  humain,
  communication,
  signa,
  secu,
  matos,
  elec,
  barrieres,
} from "./common/review";
export type { Location } from "./common/location";
export type {
  InquiryRequestAssigned,
  InquiryRequest,
  BaseInquiryRequest,
} from "./common/inquiry-request";
export { isAssignedToDrive } from "./common/inquiry-request";

//  **********************
//  FESTIVAL ACTIVITY MODULE
//  **********************
export type {
  Draft,
  Reviewable,
  InReview,
  Validated,
  Refused,
  FestivalActivity,
  CreateFestivalActivityForm,
  KeyEvent,
  PreviewDraft,
  PreviewReviewable,
  PreviewFestivalActivity,
} from "./festival-activity/festival-activity";
export { isDraft, isRefused } from "./festival-activity/festival-activity";
export { FestivalActivityError } from "./festival-activity/festival-activity.error";

export type { Contractor } from "./festival-activity/sections/in-charge";

// INQUIRY
export type {
  InquiryWithPotentialRequests,
  InquiryWithRequests,
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

// REVIEWS
export type { WaitingForReview } from "./festival-activity/sections/reviews";
export {
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

//  **********************
//  FESTIVAL TASK MODULE
//  **********************
export { FestivalTaskError } from "./festival-task/festival-task.error";
