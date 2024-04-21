import { FestivalEvent } from "@overbookd/festival-event";
import {
  DRAFT,
  REFUSED,
  IN_REVIEW,
  VALIDATED,
  READY_TO_ASSIGN,
} from "@overbookd/festival-event-constants";

export const GREY = "grey";
const RED = "red";
const ORANGE = "orange";
const GREEN = "green";
const PURPLE = "#673ab7";

export type StatusColor =
  | typeof GREY
  | typeof RED
  | typeof ORANGE
  | typeof GREEN
  | typeof PURPLE;

const statusColors = new Map<FestivalEvent["status"], StatusColor>([
  [DRAFT, GREY],
  [REFUSED, RED],
  [IN_REVIEW, ORANGE],
  [VALIDATED, GREEN],
  [READY_TO_ASSIGN, PURPLE],
]);

export function getColorByStatus(status: FestivalEvent["status"]): StatusColor {
  return statusColors.get(status) || "grey";
}
