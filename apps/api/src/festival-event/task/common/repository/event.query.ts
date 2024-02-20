import { FestivalTaskKeyEvent as KeyEvent } from "@overbookd/festival-event";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";

export const SELECT_EVENT = {
  event: true,
  instigator: { select: SELECT_VOLUNTEER },
  at: true,
  context: true,
};

export type DatabaseEvent = {
  event: KeyEvent["action"];
  instigator: KeyEvent["by"];
  at: KeyEvent["at"];
  context: KeyEvent["description"];
};
