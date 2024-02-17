import {
  DRAFT,
  FestivalTaskWithConflicts as FestivalTask,
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

function isHttpDraft(
  task: HttpStringified<FestivalTask>,
): task is HttpStringified<Draft> {
  return task.status === DRAFT;
}
