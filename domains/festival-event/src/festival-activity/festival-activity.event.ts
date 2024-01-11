import { KeyEvent } from "./festival-activity";
import { CREATED, READY_TO_REVIEW } from "../common/action";
import { Adherent } from "../common/adherent";
import { APPROVED, REJECTED } from "../common/action";

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

  static approved(by: Adherent): KeyEvent {
    const at = this.computeAt();
    const description = "FA approuvée";

    return { action: APPROVED, by, at, description };
  }

  static rejected(by: Adherent, reason: string): KeyEvent {
    const at = this.computeAt();
    const description = `FA rejetée pour la raison suivante: ${reason}`;

    return { action: REJECTED, by, at, description };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
