import { KeyEvent } from "./festival-activity.js";
import { Adherent } from "../common/adherent.js";
import { Reviewer } from "../common/review.js";
import {
  APPROVED,
  CREATED,
  READY_TO_REVIEW,
  REJECTED,
} from "@overbookd/festival-event-constants";

export class FestivalActivityKeyEvents {
  static created(by: Adherent): KeyEvent {
    const at = this.computeAt();
    return { action: CREATED, by, at, description: "FA créée" };
  }

  static readyToReview(by: Adherent): KeyEvent {
    const at = this.computeAt();
    const description = "Demande de relecture de la FA";

    return { action: READY_TO_REVIEW, by, at, description };
  }

  static approved(by: Adherent, team: Reviewer<"FA">): KeyEvent {
    const at = this.computeAt();
    const description = `FA approuvée par l'équipe ${team}`;

    return { action: APPROVED, by, at, description };
  }

  static rejected(
    by: Adherent,
    team: Reviewer<"FA">,
    reason: string,
  ): KeyEvent {
    const at = this.computeAt();
    const description = `FA rejetée par l'équipe ${team} pour la raison suivante: ${reason}`;

    return { action: REJECTED, by, at, description };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
