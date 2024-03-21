import {
  DRAFT,
  FestivalTask,
  IN_REVIEW,
  PreviewFestivalTask as Preview,
  PreviewFestivalTaskDraft as PreviewDraft,
  READY_TO_ASSIGN,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event";
import {
  BROUILLON,
  PRETE_POUR_AFFECTATION,
  REFUSEE,
  RELECTURE_EN_COURS,
  VALIDEE,
} from "../festival-event.model";

export type FtStatusLabel =
  | typeof BROUILLON
  | typeof RELECTURE_EN_COURS
  | typeof REFUSEE
  | typeof VALIDEE
  | typeof PRETE_POUR_AFFECTATION;

export const ftStatusLabels = new Map<FestivalTask["status"], FtStatusLabel>([
  [DRAFT, BROUILLON],
  [IN_REVIEW, RELECTURE_EN_COURS],
  [REFUSED, REFUSEE],
  [VALIDATED, VALIDEE],
  [READY_TO_ASSIGN, PRETE_POUR_AFFECTATION],
]);

export function isDraftPreview(task: Preview): task is PreviewDraft {
  return task.status === DRAFT;
}
