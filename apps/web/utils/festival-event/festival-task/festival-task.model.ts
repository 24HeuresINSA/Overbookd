import {
  DRAFT,
  FestivalTask,
  PreviewFestivalTask as Preview,
  PreviewFestivalTaskDraft as PreviewDraft,
} from "@overbookd/festival-event";
import { BROUILLON } from "../festival-event.model";

export type FtStatusLabel = typeof BROUILLON;

export const ftStatusLabels = new Map<FestivalTask["status"], FtStatusLabel>([
  [DRAFT, BROUILLON],
]);

export function isDraftPreview(task: Preview): task is PreviewDraft {
  return task.status === DRAFT;
}
