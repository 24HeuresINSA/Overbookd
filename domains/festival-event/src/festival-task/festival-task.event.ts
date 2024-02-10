import { COMMENTED, CREATED } from "../common/action";
import { Adherent } from "../common/adherent";

type Action = typeof CREATED | typeof COMMENTED;

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
  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
