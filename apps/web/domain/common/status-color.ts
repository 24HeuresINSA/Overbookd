import {
  DRAFT,
  FestivalEvent,
  IN_REVIEW,
  READY_TO_ASSIGN,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event";

const GREY = "grey";
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
