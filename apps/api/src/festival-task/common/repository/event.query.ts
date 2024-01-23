import { FestivalTaskKeyEvent as KeyEvent } from "@overbookd/festival-event";
import { SELECT_ADHERENT } from "./adherent/adherent.query";

export const SELECT_EVENT = {
  event: true,
  instigator: { select: SELECT_ADHERENT },
  at: true,
  context: true,
};

export type DatabaseEvent = {
  event: KeyEvent["action"];
  instigator: KeyEvent["by"];
  at: KeyEvent["at"];
  context: KeyEvent["description"];
};
