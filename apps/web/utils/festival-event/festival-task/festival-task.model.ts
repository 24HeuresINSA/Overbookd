import { DRAFT, FestivalTask } from "@overbookd/festival-event";
import { BROUILLON } from "../festival-event.model";

export type FtStatusLabel = typeof BROUILLON;

export const ftStatusLabels = new Map<FestivalTask["status"], FtStatusLabel>([
  [DRAFT, BROUILLON],
]);
