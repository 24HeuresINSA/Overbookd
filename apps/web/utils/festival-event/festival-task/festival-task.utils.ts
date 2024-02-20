import {
  DRAFT,
  ReviewStatus,
  FestivalTaskWithConflicts as FestivalTask,
  humain,
  matos,
  elec,
  isFestivalTaskDraft,
  NOT_ASKING_TO_REVIEW,
} from "@overbookd/festival-event";
import { DraftWithConflicts as Draft, HttpStringified } from "@overbookd/http";
import { CastDraft } from "./draft";
import { CastInReview } from "./in-review";

export function castTaskWithDate(
  task: HttpStringified<FestivalTask>,
): FestivalTask {
  if (isHttpDraft(task)) {
    return CastDraft.withDate(task);
  }
  return CastInReview.withDate(task);
}

export function getTaskReviewStatus(
  festivalTask: FestivalTask,
  reviewer: string,
): ReviewStatus {
  if (isFestivalTaskDraft(festivalTask)) return NOT_ASKING_TO_REVIEW;
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
