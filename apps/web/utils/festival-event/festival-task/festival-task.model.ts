import { DRAFT, FestivalTask } from "@overbookd/festival-event";

export const BROUILLON = "Brouillon";

export type FtStatusLabel = typeof BROUILLON;

export const ftStatusLabels = new Map<FestivalTask["status"], FtStatusLabel>([
  [DRAFT, BROUILLON],
]);
