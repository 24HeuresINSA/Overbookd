import {
  DRAFT,
  FestivalActivity,
  IN_REVIEW,
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

const statusColors = new Map<FestivalActivity["status"], StatusColor>([
  [DRAFT, GREY],
  [REFUSED, RED],
  [IN_REVIEW, ORANGE],
  [VALIDATED, GREEN],
]);

export function getColorByStatus(
  status: FestivalActivity["status"],
): StatusColor {
  return statusColors.get(status) || "grey";
}
