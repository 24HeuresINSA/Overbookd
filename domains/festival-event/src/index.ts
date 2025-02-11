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
  FORCED_UPDATE,
} from "./common/action.js";
export type { Adherent } from "./common/adherent.js";
export type { Feedback } from "./common/feedback.js";
export type { FestivalEventIdentifier } from "./common/festival-event.js";
export {
  isAssignedToDrive,
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
  MAGASIN,
  MDE,
  SALLE_MONTREAL,
  SALLE_RENE_CHAR,
  NON_STOCKE,
  QG_ORGA,
  BACKLINE,
  SALLE_CRLA,
  LIVRE_PAR_LOGISTIQUE,
  LIVRE_PAR_COM,
  drives,
} from "./common/inquiry-request.js";
export type {
  InquiryRequestAssigned,
  InquiryRequest,
  BaseInquiryRequest,
  Drive,
  AssignDrive,
} from "./common/inquiry-request.js";
export type { Location } from "./common/location.js";
export type {
  WaitingForReview,
  Notifications,
  Notifyee,
} from "./common/notifications.js";
export {
  REVIEWING,
  NOT_ASKING_TO_REVIEW,
  WILL_NOT_REVIEW,
  humain,
  communication,
  signa,
  secu,
  matos,
  elec,
  barrieres,
  isRefusedReviews,
  isValidatedReviews,
} from "./common/review.js";
export type {
  ReviewStatus,
  Reviewer,
  InReviewReviews,
  ValidatedReviews,
  RefusedReviews,
  ApprovalReviewStatus,
  RejectionReviewStatus,
  ReviewingStatus,
} from "./common/review.js";
export type { TimeWindow } from "./common/time-window.js";

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
} from "./festival-activity/festival-activity.js";
export { FestivalActivityError } from "./festival-activity/festival-activity.error.js";
export { previewOf as previewOfActivity } from "./festival-activity/preview-of";

export type { Contractor } from "./festival-activity/sections/in-charge.js";

// INQUIRY
export type {
  InquiryWithPotentialRequests,
  InquiryWithRequests,
  InquiryOwner,
  WithInquiries,
} from "./festival-activity/sections/inquiry.js";
export {
  MATOS,
  BARRIERES,
  ELEC,
} from "./festival-activity/sections/inquiry.js";

export type {
  ElectricitySupply,
  ElectricityConnection,
} from "./festival-activity/sections/supply.js";
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
} from "./festival-activity/sections/supply.js";

export type { Public as PublicGeneral } from "./festival-activity/sections/general.js";
export type {
  Signage,
  SignageType,
  BaseSignage,
  SignageCatalogItem,
} from "./festival-activity/sections/signa.js";
export {
  BACHE,
  PANNEAU,
  AFFICHE,
  signageTypes,
  isLinkedToCatalogItem,
} from "./festival-activity/sections/signa.js";

// CREATION
export { CreateFestivalActivity } from "./festival-activity/creation/creation.js";
export type {
  FestivalActivityCreationForm,
  CreateFestivalActivityRepository,
} from "./festival-activity/creation/creation.js";
export { InMemoryCreateFestivalActivityRepository } from "./festival-activity/creation/festival-activities.inmemory.js";
export { defaultDraft } from "./festival-activity/festival-activity.factory.js";

// PREPARATION
export { PrepareFestivalActivity } from "./festival-activity/preparation/prepare-festival-activity.js";
export type {
  PrepareFestivalActivityRepository,
  InitInquiry,
} from "./festival-activity/preparation/prepare-festival-activity.js";
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
} from "./festival-activity/preparation/prepare-festival-activity.model.js";

//ASK FOR REVIEW
export { InMemoryAskForReviewFestivalActivityRepository } from "./festival-activity/ask-for-review/festival-activities.inmemory.js";
export type {
  FestivalActivityWithoutStatus,
  InReviewWithoutStatus,
} from "./festival-activity/ask-for-review/in-review-festival-activity.js";
export { ReviewableSpecification } from "./festival-activity/ask-for-review/in-review-festival-activity.js";
export { AskForReview } from "./festival-activity/ask-for-review/ask-for-review.js";
export type { AskForReviewFestivalActivityRepository } from "./festival-activity/ask-for-review/ask-for-review.js";
export { isReviewer as isActivityReviewer } from "./festival-activity/ask-for-review/ask-for-review.js";

// Reviewing
export { Reviewing } from "./festival-activity/reviewing/reviewing.js";
export type { ReviewingFestivalActivities } from "./festival-activity/reviewing/reviewing.js";

//  **********************
//  FESTIVAL TASK MODULE
//  **********************
export { FestivalTaskError } from "./festival-task/festival-task.error.js";
export type { FestivalTasksForCreate } from "./festival-task/create/create.js";
export { CreateFestivalTask } from "./festival-task/create/create.js";
export type {
  AskForReviewTasks,
  Reviewers,
  ReviewerStat,
} from "./festival-task/ask-for-review/ask-for-review.js";
export {
  AskForReview as AskForReviewTask,
  isReviewer as isTaskReviewer,
} from "./festival-task/ask-for-review/ask-for-review.js";
export {
  InReviewSpecification,
  InChargeInstructionsSpecification,
} from "./festival-task/ask-for-review/in-review-specification.js";
export type {
  FestivalTasksForPrepare,
  UpdateGeneral,
  UpdateInstructions,
  AddMobilization,
  UpdateMobilization,
} from "./festival-task/prepare/prepare.js";
export {
  PrepareFestivalTask,
  extractApprovers,
} from "./festival-task/prepare/prepare.js";
export type { FestivalTasksForView } from "./festival-task/view/view.js";
export { ViewFestivalTask } from "./festival-task/view/view.js";
export { EnableAssignment } from "./festival-task/enable-assignment/enable-assignment.js";
export type { FestivalTasksForEnableAssignment } from "./festival-task/enable-assignment/enable-assignment.js";
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
} from "./festival-task/festival-task.js";
export { isReadyToAssign } from "./festival-task/festival-task.js";
export { previewOf as previewOfTask } from "./festival-task/preview-of";
export type {
  Volunteer,
  Contact,
  WithoutInChargeInstructions,
  WithInChargeInstructions,
} from "./festival-task/sections/instructions.js";
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
} from "./festival-task/sections/mobilizations.js";
export {
  requirableTeams,
  requirableTeamsExtended,
} from "./festival-task/sections/mobilizations.js";
export type { KeyEvent as FestivalTaskKeyEvent } from "./festival-task/festival-task.event.js";
export type {
  VolunteerConflicts,
  WithConflicts as FestivalTaskWithConflicts,
  WithoutConflicts as FestivalTaskWithoutConflicts,
  DraftWithoutConflicts,
  RefusedWithoutConflicts,
  ReviewableWithoutConflicts,
  ReadyToAssignWithoutConflicts,
  ReadyToAssignWithConflicts,
} from "./festival-task/volunteer-conflicts.js";
export { FestivalTaskTranslator } from "./festival-task/volunteer-conflicts.js";
export {
  Review as ReviewTask,
  canIgnoreFestivalTaskAs,
} from "./festival-task/review/review.js";
export type { FestivalTasksForReview } from "./festival-task/review/review.js";
export type {
  ForceInstructions,
  ForceGlobalInstructions,
  ForceInChargeInstructions,
} from "./festival-task/prepare/sections/instructions.js";

//  **********************
//  FESTIVAL EVENT MODULE
//  **********************
export type { FestivalEvent } from "./festival-event.js";
export {
  FestivalEventError,
  isDraft,
  isInReview,
  isRefused,
  isValidated,
} from "./festival-event.js";
