import {
  type ReviewStatus,
  type PreviewFestivalTask,
  type FestivalTaskWithConflicts as FestivalTask,
  humain,
  matos,
  elec,
  NOT_ASKING_TO_REVIEW,
  isDraft,
  extractApprovers,
  isRefused,
} from "@overbookd/festival-event";
import type {
  DraftWithConflicts as Draft,
  HttpStringified,
} from "@overbookd/http";
import { DRAFT } from "@overbookd/festival-event-constants";
import { CastDraft } from "./draft";
import { isDraftPreview } from "./festival-task.model";
import { CastReviewable } from "./reviewable";

export function castTaskWithDate(
  task: HttpStringified<FestivalTask>,
): FestivalTask {
  if (isHttpDraft(task)) {
    return CastDraft.withDate(task);
  }
  return CastReviewable.withDate(task);
}

export function getTaskReviewStatus(
  festivalTask: FestivalTask,
  reviewer: string,
): ReviewStatus {
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

export function getPreviewReviewStatus(
  preview: PreviewFestivalTask,
  reviewer: string,
): ReviewStatus {
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

export function shouldResetTaskApprovals(task: FestivalTask): boolean {
  if (isDraft(task)) return false;
  const isTaskRefused = isRefused(task);
  const hasApprovals = extractApprovers(task).length > 0;
  return isTaskRefused && hasApprovals;
}
