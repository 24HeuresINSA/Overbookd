import {
  DRAFT,
  FestivalTask,
  IN_REVIEW,
  PreviewFestivalTask as Preview,
  PreviewFestivalTaskDraft as PreviewDraft,
  REFUSED,
} from "@overbookd/festival-event";
import {
  BROUILLON,
  REFUSEE,
  RELECTURE_EN_COURS,
} from "../festival-event.model";

export type FtStatusLabel =
  | typeof BROUILLON
  | typeof RELECTURE_EN_COURS
  | typeof REFUSEE;

export const ftStatusLabels = new Map<FestivalTask["status"], FtStatusLabel>([
  [DRAFT, BROUILLON],
  [IN_REVIEW, RELECTURE_EN_COURS],
  [REFUSED, REFUSEE],
]);

export function isDraftPreview(task: Preview): task is PreviewDraft {
  return task.status === DRAFT;
}
