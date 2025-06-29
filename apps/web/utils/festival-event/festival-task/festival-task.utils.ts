import {
  type ReviewStatus,
  type PreviewFestivalTask,
  type FestivalTaskWithConflicts as FestivalTask,
  humain,
  matos,
  elec,
  isDraft,
  extractApprovers,
  isRefused,
  type Reviewer,
  type PreviewFestivalTaskDraft,
} from "@overbookd/festival-event";
import type {
  DraftWithConflicts as Draft,
  HttpStringified,
} from "@overbookd/http";
import {
  APPROVED,
  DRAFT,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
  WILL_NOT_REVIEW,
} from "@overbookd/festival-event-constants";
import { CastDraft } from "./draft";
import { CastReviewable } from "./reviewable";

export function castTaskWithDate(
  task: HttpStringified<FestivalTask>,
): FestivalTask {
  if (isHttpDraft(task)) {
    return CastDraft.withDate(task);
  }
  return CastReviewable.withDate(task);
}

export function getTaskReviewerStatus(
  festivalTask: FestivalTask,
  reviewer: string,
): ReviewStatus<"FT"> {
  if (isDraft(festivalTask)) return NOT_ASKING_TO_REVIEW;
  switch (reviewer) {
    case humain:
      return festivalTask.reviews.humain;
    case matos:
      return festivalTask.reviews.matos;
    case elec:
      return festivalTask.reviews.elec;
    default:
      return NOT_ASKING_TO_REVIEW;
  }
}

function isHttpDraft(
  task: HttpStringified<FestivalTask>,
): task is HttpStringified<Draft> {
  return task.status === DRAFT;
}

export function isDraftPreview(
  task: PreviewFestivalTask,
): task is PreviewFestivalTaskDraft {
  return task.status === DRAFT;
}

export function getPreviewReviewerStatus(
  preview: PreviewFestivalTask,
  reviewer: string,
): ReviewStatus<"FT"> {
  if (isDraftPreview(preview)) return NOT_ASKING_TO_REVIEW;

  switch (reviewer) {
    case humain:
      return preview.reviews.humain;
    case matos:
      return preview.reviews.matos;
    case elec:
      return preview.reviews.elec;
    default:
      return NOT_ASKING_TO_REVIEW;
  }
}

export function hasTaskApprovals(task: FestivalTask): boolean {
  if (isDraft(task)) return false;
  return extractApprovers(task).length > 0;
}

export function shouldResetTaskApprovals(task: FestivalTask): boolean {
  if (isDraft(task)) return false;
  const isTaskRefused = isRefused(task);
  const hasApprovals = extractApprovers(task).length > 0;
  return isTaskRefused && hasApprovals;
}

export function findTaskReviewerStatusByString(
  status: string,
): ReviewStatus<"FT"> | undefined {
  switch (status) {
    case REJECTED:
    case APPROVED:
    case REVIEWING:
    case NOT_ASKING_TO_REVIEW:
    case WILL_NOT_REVIEW:
      return status;
    default:
      return undefined;
  }
}

export function hasReviewerAlreadyDoneHisTaskReview(
  task: FestivalTask,
  reviewer: Reviewer<"FT">,
  status: ReviewStatus<"FT">,
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
