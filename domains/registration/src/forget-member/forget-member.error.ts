export const ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE =
  "Nous ne pouvons pas t'effacer d'Overbook.\nTu es affecte a une tache a venir.\nContacte les responsables benevoles pour t'aider.";

export const IN_DEBT_ERROR_MESSAGE =
  "Nous ne pouvons pas t'effacer d'Overbook.\nTu as des dettes aupres de l'association.\nContacte le tresorier ou le secretaire general pour t'aider.";

class ForgetMemberError extends Error {}

export class AssignedInFuturTask extends ForgetMemberError {
  constructor() {
    super(ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE);
  }
}

export class InDebt extends ForgetMemberError {
  constructor() {
    super(IN_DEBT_ERROR_MESSAGE);
  }
}
