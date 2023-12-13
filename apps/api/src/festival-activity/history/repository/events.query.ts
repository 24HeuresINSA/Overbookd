import { SELECT_ADHERENT } from "../../repository/adherent.query";

export const SELECT_KEY_EVENT = {
  at: true,
  reason: true,
  event: true,
  instigator: { select: SELECT_ADHERENT },
};
