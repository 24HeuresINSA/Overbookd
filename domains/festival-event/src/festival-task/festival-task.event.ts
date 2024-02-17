import { COMMENTED, CREATED, READY_TO_REVIEW } from "../common/action";
import { Adherent } from "../common/adherent";

type Action = typeof CREATED | typeof COMMENTED | typeof READY_TO_REVIEW;

export type KeyEvent = {
  action: Action;
  by: Adherent;
  at: Date;
  description: string;
};
export class FestivalTaskKeyEvents {
  static created(by: Adherent): KeyEvent {
    const at = this.computeAt();
    return { action: CREATED, by, at, description: "FT créée" };
  }

  static readyToReview(by: Adherent): KeyEvent {
    const at = this.computeAt();
    const description = "Demande de relecture de la FT";
    return { action: READY_TO_REVIEW, by, at, description };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
