import {
  APPROVED,
  barrieres,
  communication,
  elec,
  humain,
  isDraft,
  matos,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
  secu,
  signa,
  type FestivalActivity,
  type FestivalTask,
  type Reviewer,
  type ReviewStatus,
} from "@overbookd/festival-event";
import {
  DRAFT,
  IN_REVIEW,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";

const A_RELIRE = "À relire";
const REJETEE = "Rejetée";
const APPROUVEE = "Approuvée";

export type ReviewLabel = typeof A_RELIRE | typeof APPROUVEE | typeof REJETEE;

export const reviewStatusLabel = new Map<ReviewStatus, ReviewLabel>([
  [REVIEWING, A_RELIRE],
  [REJECTED, REJETEE],
  [APPROVED, APPROUVEE],
]);

export function hasReviewerAlreadyDoneHisTaskReview(
  task: FestivalTask,
  reviewer: Reviewer<"FT">,
  status: ReviewStatus,
) {
  if (isDraft(task)) return true;
  switch (reviewer) {
    case humain:
      return task.reviews.humain === status;
    case matos:
      return task.reviews.matos === status;
    case elec:
      return task.reviews.elec === status;
    default:
      return false;
  }
}

export function hasReviewerAlreadyDoneHisActivityReview(
  activity: FestivalActivity,
  reviewer: Reviewer<"FA">,
  status: ReviewStatus,
) {
  if (isDraft(activity)) return true;
  switch (reviewer) {
    case humain:
      return activity.reviews.humain === status;
    case matos:
      return activity.reviews.matos === status;
    case elec:
      return activity.reviews.elec === status;
    case signa:
      return activity.reviews.signa === status;
    case secu:
      return activity.reviews.secu === status;
    case barrieres:
      return activity.reviews.barrieres === status;
    case communication:
      return activity.reviews.communication === status;
    default:
      return false;
  }
}

export type FestivalEventStatus =
  | FestivalActivity["status"]
  | FestivalTask["status"];

export function isFestivalActivityStatus(
  status: FestivalEventStatus,
): status is FestivalActivity["status"] {
  return (
    status === DRAFT ||
    status === IN_REVIEW ||
    status === REFUSED ||
    status === VALIDATED
  );
}

export function findReviewStatus(status: string): ReviewStatus | undefined {
  if (!status) return undefined;
  switch (status) {
    case REJECTED:
      return REJECTED;
    case APPROVED:
      return APPROVED;
    case REVIEWING:
      return REVIEWING;
    case NOT_ASKING_TO_REVIEW:
    default:
      return NOT_ASKING_TO_REVIEW;
  }
}
