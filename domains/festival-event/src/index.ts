//  **********************
//  COMMON MODULE
//  **********************
export type { Adherent } from "./common/adherent.js";
export type { Feedback } from "./common/feedback.js";
export type { FestivalEventIdentifier } from "./common/festival-event.js";
export {
  BACKLINE,
  BENNE_COLLETTE_BESSON,
  BENNE_PARKING_K_FET,
  CAVE_BIKERS,
  CAVE_E,
  CLUB_ROCK,
  CONTENEUR_KARNA,
  CONTENEUR_PARKING_K_FET,
  CONTENEUR_SCENE_PULSE,
  CONTENUR_24H,
  CREUX_GCU,
  CREUX_GM,
  drives,
  HALL_DES_HUMANITES,
  isAssignedToDrive,
  LIVRE_PAR_BAR,
  LIVRE_PAR_COM,
  LIVRE_PAR_LOGISTIQUE,
  LIVRE_PAR_TEAM_ELEC,
  LOCAL_24H,
  MAGASIN,
  MDE,
  NON_STOCKE,
  PARKING_EIFFEL,
  QG_ORGA,
  SALLE_CRLA,
  SALLE_CRLB,
  SALLE_MONTREAL,
  SALLE_RENE_CHAR,
} from "./common/inquiry-request.js";
export type {
  AssignDrive,
  BaseInquiryRequest,
  Drive,
  InquiryRequest,
  InquiryRequestAssigned,
} from "./common/inquiry-request.js";
export type { Location } from "./common/location.js";
export type {
  Notifications,
  Notifyee,
  WaitingForReview,
} from "./common/notifications.js";
export {
  getNameFromReviewer,
  isRefusedReviews,
  isValidatedReviews,
} from "./common/review.js";
export type {
  ApprovalReviewStatus,
  InReviewReviews,
  RefusedReviews,
  RejectionReviewStatus,
  Reviewer,
  ReviewingStatus,
  ReviewStatus,
  ValidatedReviews,
} from "./common/review.js";
export type { TimeWindow } from "./common/time-window.js";

//  **********************
//  FESTIVAL ACTIVITY MODULE
//  **********************
export { FestivalActivityError } from "./festival-activity/festival-activity.error.js";
export type {
  CreateFestivalActivityForm,
  Draft,
  FestivalActivity,
  KeyEvent as FestivalActivityKeyEvent,
  FestivalTaskChild,
  InReview,
  PreviewDraft,
  PreviewFestivalActivity,
  PreviewReviewable,
  Refused,
  Reviewable,
  Validated,
} from "./festival-activity/festival-activity.js";
export { previewOf as previewOfActivity } from "./festival-activity/preview-of";

export type { Contractor } from "./festival-activity/sections/in-charge.js";

// INQUIRY
export type {
  InquiryOwner,
  InquiryWithPotentialRequests,
  InquiryWithRequests,
  WithInquiries,
} from "./festival-activity/sections/inquiry.js";

export {
  P17_125A_TETRA,
  P17_16A_MONO,
  P17_16A_TETRA,
  P17_16A_TRI,
  P17_32A_MONO,
  P17_32A_TETRA,
  P17_32A_TRI,
  P17_63A_MONO,
  P17_63A_TETRA,
  P17_63A_TRI,
  PC16_Prise_classique,
} from "./festival-activity/sections/supply.js";
export type {
  ElectricityConnection,
  ElectricitySupply,
} from "./festival-activity/sections/supply.js";

export type { Public as PublicGeneral } from "./festival-activity/sections/general.js";
export {
  AFFICHE,
  BACHE,
  isLinkedToCatalogItem,
  PANNEAU,
  signageTypes,
} from "./festival-activity/sections/signa.js";
export type {
  BaseSignage,
  Signage,
  SignageCatalogItem,
  SignageType,
} from "./festival-activity/sections/signa.js";

// CREATION
export { CreateFestivalActivity } from "./festival-activity/creation/creation.js";
export type {
  CreateFestivalActivityRepository,
  FestivalActivityCreationForm,
} from "./festival-activity/creation/creation.js";
export { InMemoryCreateFestivalActivityRepository } from "./festival-activity/creation/festival-activities.inmemory.js";
export { defaultDraft } from "./festival-activity/festival-activity.factory.js";

// PREPARATION
export { PrepareFestivalActivity } from "./festival-activity/preparation/prepare-festival-activity.js";
export type {
  InitInquiry,
  PrepareFestivalActivityRepository,
} from "./festival-activity/preparation/prepare-festival-activity.js";
export type {
  PrepareContractorCreation,
  PrepareContractorUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareInquiryRequestCreation,
  PrepareSecurityUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
} from "./festival-activity/preparation/prepare-festival-activity.model.js";

//ASK FOR REVIEW
export {
  AskForReview,
  isReviewer as isActivityReviewer,
} from "./festival-activity/ask-for-review/ask-for-review.js";
export type { AskForReviewFestivalActivityRepository } from "./festival-activity/ask-for-review/ask-for-review.js";
export { InMemoryAskForReviewFestivalActivityRepository } from "./festival-activity/ask-for-review/festival-activities.inmemory.js";
export { ReviewableSpecification } from "./festival-activity/ask-for-review/in-review-festival-activity.js";
export type {
  FestivalActivityWithoutStatus,
  InReviewWithoutStatus,
} from "./festival-activity/ask-for-review/in-review-festival-activity.js";

// Reviewing
export { Reviewing } from "./festival-activity/reviewing/reviewing.js";
export type { ReviewingFestivalActivities } from "./festival-activity/reviewing/reviewing.js";

//  **********************
//  FESTIVAL TASK MODULE
//  **********************
export {
  AskForReview as AskForReviewTask,
  isReviewer as isTaskReviewer,
} from "./festival-task/ask-for-review/ask-for-review.js";
export type {
  AskForReviewTasks,
  Reviewers,
  ReviewerStat,
} from "./festival-task/ask-for-review/ask-for-review.js";
export {
  InChargeInstructionsSpecification,
  InReviewSpecification,
} from "./festival-task/ask-for-review/in-review-specification.js";
export { CreateFestivalTask } from "./festival-task/create/create.js";
export type { FestivalTasksForCreate } from "./festival-task/create/create.js";
export { EnableAssignment } from "./festival-task/enable-assignment/enable-assignment.js";
export type { FestivalTasksForEnableAssignment } from "./festival-task/enable-assignment/enable-assignment.js";
export { FestivalTaskError } from "./festival-task/festival-task.error.js";
export type { KeyEvent as FestivalTaskKeyEvent } from "./festival-task/festival-task.event.js";
export { isReadyToAssign } from "./festival-task/festival-task.js";
export type {
  Categorize,
  FestivalTask,
  Draft as FestivalTaskDraft,
  InReview as FestivalTaskInReview,
  ReadyToAssign as FestivalTaskReadyToAssign,
  Refused as FestivalTaskRefused,
  Reviewable as FestivalTaskReviewable,
  Validated as FestivalTaskValidated,
  Preview as PreviewFestivalTask,
  PreviewDraft as PreviewFestivalTaskDraft,
  PreviewInReview as PreviewFestivalTaskInReview,
  PreviewReadyToAssign as PreviewFestivalTaskReadyToAssign,
  PreviewRefused as PreviewFestivalTaskRefused,
  PreviewReviewable as PreviewFestivalTaskReviewable,
  PreviewValidated as PreviewFestivalTaskValidated,
} from "./festival-task/festival-task.js";
export {
  extractApprovers,
  PrepareFestivalTask,
} from "./festival-task/prepare/prepare.js";
export type {
  AddMobilization,
  FestivalTasksForPrepare,
  UpdateGeneral,
  UpdateInstructions,
  UpdateMobilization,
} from "./festival-task/prepare/prepare.js";
export type {
  ForceGlobalInstructions,
  ForceInChargeInstructions,
  ForceInstructions,
} from "./festival-task/prepare/sections/instructions.js";
export { previewOf as previewOfTask } from "./festival-task/preview-of";
export { RemoveFestivalTask } from "./festival-task/remove/remove.js";
export type { FestivalTasksForRemoval } from "./festival-task/remove/remove.js";
export {
  canIgnoreFestivalTaskAs,
  Review as ReviewTask,
} from "./festival-task/review/review.js";
export type { FestivalTasksForReview } from "./festival-task/review/review.js";
export type {
  Contact,
  Volunteer,
  WithInChargeInstructions,
  WithoutInChargeInstructions,
} from "./festival-task/sections/instructions.js";
export {
  requirableTeams,
  requirableTeamsExtended,
} from "./festival-task/sections/mobilizations.js";
export type {
  Assignment,
  AtLeastOneTeam,
  AtLeastOneVolunteer,
  Conflicts,
  FestivalTaskLink,
  Mobilization,
  MobilizationOptions,
  ReviewableMobilization,
  TeamMobilization,
  VolunteerWithConflicts,
} from "./festival-task/sections/mobilizations.js";
export { ViewFestivalTask } from "./festival-task/view/view.js";
export type { FestivalTasksForView } from "./festival-task/view/view.js";
export { FestivalTaskTranslator } from "./festival-task/volunteer-conflicts.js";
export type {
  DraftWithoutConflicts,
  WithConflicts as FestivalTaskWithConflicts,
  WithoutConflicts as FestivalTaskWithoutConflicts,
  ReadyToAssignWithConflicts,
  ReadyToAssignWithoutConflicts,
  RefusedWithoutConflicts,
  ReviewableWithoutConflicts,
  VolunteerConflicts,
} from "./festival-task/volunteer-conflicts.js";

//  **********************
//  FESTIVAL EVENT MODULE
//  **********************
export {
  FestivalEventError,
  isDraft,
  isInReview,
  isRefused,
  isValidated,
} from "./festival-event.js";
export type { FestivalEvent } from "./festival-event.js";
