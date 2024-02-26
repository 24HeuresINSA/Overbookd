import {
  APPROVED,
  COMMENTED,
  CREATED,
  READY_TO_REVIEW,
  REJECTED,
  RESET_REVIEW,
} from "../common/action";
import { Adherent } from "../common/adherent";
import { UpdateInstructions } from "./prepare/prepare";

type Action =
  | typeof CREATED
  | typeof COMMENTED
  | typeof READY_TO_REVIEW
  | typeof REJECTED
  | typeof APPROVED
  | typeof RESET_REVIEW;

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

  static resetReview(by: Adherent, update: UpdateInstructions): KeyEvent {
    const at = this.computeAt();
    const field = update.global
      ? "instructions"
      : "instructions des responsables";
    const description = `Précédentes approbations réinitialisées par un changement sur le champs ${field}`;
    return { action: RESET_REVIEW, by, at, description };
  }

  static readyToReview(by: Adherent): KeyEvent {
    const at = this.computeAt();
    const description = "Demande de relecture de la FT";
    return { action: READY_TO_REVIEW, by, at, description };
  }

  static rejected(by: Adherent, reason: string): KeyEvent {
    const at = this.computeAt();
    const description = `FT rejetée pour la raison suivante: ${reason}`;

    return { action: REJECTED, by, at, description };
  }

  static approved(by: Adherent): KeyEvent {
    const at = this.computeAt();
    const description = "FT approuvée";

    return { action: APPROVED, by, at, description };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
