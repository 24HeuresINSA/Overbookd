import { FTStatus } from "~/utils/models/ft";

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

const statusColors = new Map<FTStatus, StatusColor>([
  [FTStatus.DRAFT, GREY],
  [FTStatus.REFUSED, RED],
  [FTStatus.SUBMITTED, ORANGE],
  [FTStatus.VALIDATED, GREEN],
  [FTStatus.READY, PURPLE],
]);

export function getColorByStatus(status: FTStatus): StatusColor {
  return statusColors.get(status) || "grey";
}
