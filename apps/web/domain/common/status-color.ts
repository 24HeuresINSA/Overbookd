import { FtStatus } from "~/utils/models/ft";

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

const statusColors = new Map<FtStatus, StatusColor>([
  [FtStatus.DRAFT, GREY],
  [FtStatus.REFUSED, RED],
  [FtStatus.SUBMITTED, ORANGE],
  [FtStatus.VALIDATED, GREEN],
  [FtStatus.READY, PURPLE],
]);

export function getColorByStatus(status: FtStatus): StatusColor {
  return statusColors.get(status) || "grey";
}
