import { FTStatus } from "~/utils/models/ft";

enum StatusColor {
  DRAFT = "grey",
  REFUSED = "red",
  SUBMITTED = "orange",
  VALIDATED = "green",
  READY = "#673ab7",
}

export function getColorByStatus(status: FTStatus): StatusColor {
  return StatusColor[status];
}
