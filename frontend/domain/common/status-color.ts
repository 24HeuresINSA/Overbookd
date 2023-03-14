import { FTStatus } from "~/utils/models/ft";

type StatusColor = "grey" | "red" | "orange" | "green" | "#673ab7";

const statusColors = new Map<FTStatus, StatusColor>([
  [FTStatus.DRAFT, "grey"],
  [FTStatus.REFUSED, "red"],
  [FTStatus.SUBMITTED, "orange"],
  [FTStatus.VALIDATED, "green"],
  [FTStatus.READY, "#673ab7"],
]);

export function getColorByStatus(status: FTStatus): StatusColor {
  return statusColors.get(status) || "grey";
}
