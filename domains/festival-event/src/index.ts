//  **********************
//  COMMON MODULE
//  **********************
export {
  CREATED,
  COMMENTED,
  READY_TO_REVIEW,
  APPROVED,
  REJECTED,
  RESET_REVIEW,
  ASSIGNMENT_STARTED,
} from "./common/action";
export type { Adherent } from "./common/adherent";
export type { Feedback } from "./common/feedback";
export type { FestivalEventIdentifier } from "./common/festival-event";
export {
  isAssignedToDrive,
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
} from "./common/inquiry-request";
export type {
  InquiryRequestAssigned,
  InquiryRequest,
  BaseInquiryRequest,
  Drive,
  AssignDrive,
} from "./common/inquiry-request";
export type { Location } from "./common/location";
export type {
  WaitingForReview,
  Notifications,
  Notifyee,
} from "./common/notifications";
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
  isRefusedReviews,
  isValidatedReviews,
} from "./common/review";
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
export {
  DRAFT,
  IN_REVIEW,
  VALIDATED,
  REFUSED,
  READY_TO_ASSIGN,
} from "./common/status";
export type { TimeWindow } from "./common/time-window";

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
  KeyEvent as FestivalActivityKeyEvent,
  PreviewDraft,
  PreviewReviewable,
  PreviewFestivalActivity,
  FestivalTaskChild,
} from "./festival-activity/festival-activity";
export { FestivalActivityError } from "./festival-activity/festival-activity.error";

export type { Contractor } from "./festival-activity/sections/in-charge";

// INQUIRY
export type {
  InquiryWithPotentialRequests,
  InquiryWithRequests,
  InquiryOwner,
  WithInquiries,
} from "./festival-activity/sections/inquiry";
export { MATOS, BARRIERES, ELEC } from "./festival-activity/sections/inquiry";

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
export type { AskForReviewFestivalActivityRepository } from "./festival-activity/ask-for-review/ask-for-review";

// Reviewing
export { Reviewing } from "./festival-activity/reviewing/reviewing";
export type { ReviewingFestivalActivities } from "./festival-activity/reviewing/reviewing";

//  **********************
//  FESTIVAL TASK MODULE
//  **********************
export { FestivalTaskError } from "./festival-task/festival-task.error";
export type { FestivalTasksForCreate } from "./festival-task/create/create";
export { CreateFestivalTask } from "./festival-task/create/create";
export type {
  AskForReviewTasks,
  Reviewers,
  ReviewerStat,
} from "./festival-task/ask-for-review/ask-for-review";
export { AskForReview as AskForReviewTask } from "./festival-task/ask-for-review/ask-for-review";
export {
  InReviewSpecification,
  InChargeInstructionsSpecification,
} from "./festival-task/ask-for-review/in-review-specification";
export type {
  FestivalTasksForPrepare,
  UpdateGeneral,
  UpdateInstructions,
  AddMobilization,
  UpdateMobilization,
} from "./festival-task/prepare/prepare";
export {
  PrepareFestivalTask,
  extractApprovers,
} from "./festival-task/prepare/prepare";
export type { FestivalTasksForView } from "./festival-task/view/view";
export { ViewFestivalTask } from "./festival-task/view/view";
export { EnableAssignment } from "./festival-task/enable-assignment/enable-assignment";
export type { FestivalTasksForEnableAssignment } from "./festival-task/enable-assignment/enable-assignment";
export type {
  FestivalTask,
  Draft as FestivalTaskDraft,
  InReview as FestivalTaskInReview,
  Refused as FestivalTaskRefused,
  Validated as FestivalTaskValidated,
  ReadyToAssign as FestivalTaskReadyToAssign,
  Reviewable as FestivalTaskReviewable,
  Preview as PreviewFestivalTask,
  PreviewDraft as PreviewFestivalTaskDraft,
  PreviewInReview as PreviewFestivalTaskInReview,
  PreviewRefused as PreviewFestivalTaskRefused,
  PreviewValidated as PreviewFestivalTaskValidated,
  PreviewReadyToAssign as PreviewFestivalTaskReadyToAssign,
  PreviewReviewable as PreviewFestivalTaskReviewable,
  Categorize,
} from "./festival-task/festival-task";
export {
  STATIQUE,
  FUN,
  BAR,
  RELOU,
  MANUTENTION,
  isReadyToAssign,
} from "./festival-task/festival-task";
export type {
  Volunteer,
  Contact,
  WithoutInChargeInstructions,
  WithInChargeInstructions,
} from "./festival-task/sections/instructions";
export type {
  Mobilization,
  ReviewableMobilization,
  Conflicts,
  TeamMobilization,
  FestivalTaskLink,
  VolunteerWithConflicts,
  AtLeastOneVolunteer,
  AtLeastOneTeam,
  Assignment,
  MobilizationOptions,
} from "./festival-task/sections/mobilizations";
export {
  requirableTeams,
  requirableTeamsExtended,
} from "./festival-task/sections/mobilizations";
export type { KeyEvent as FestivalTaskKeyEvent } from "./festival-task/festival-task.event";
export type {
  VolunteerConflicts,
  WithConflicts as FestivalTaskWithConflicts,
  WithoutConflicts as FestivalTaskWithoutConflicts,
  DraftWithoutConflicts,
  ReviewableWithoutConflicts,
  ReadyToAssignWithoutConflicts,
} from "./festival-task/volunteer-conflicts";
export { FestivalTaskTranslator } from "./festival-task/volunteer-conflicts";
export { Review as ReviewTask } from "./festival-task/review/review";
export type { FestivalTasksForReview } from "./festival-task/review/review";

//  **********************
//  FESTIVAL EVENT MODULE
//  **********************
export type { FestivalEvent } from "./festival-event";
export {
  FestivalEventError,
  isDraft,
  isInReview,
  isRefused,
  isValidated,
} from "./festival-event";
