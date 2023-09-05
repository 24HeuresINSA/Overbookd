export const ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE =
  "Nous ne pouvons pas t'effacer d'Overbookd.\nTu es affecté à une tâche à venir.\nContacte les responsables bénévoles pour t'aider.";

export const IN_DEBT_ERROR_MESSAGE =
  "Nous ne pouvons pas t'effacer d'Overbookd.\nTu as des dettes auprès de l'association.\nContacte le secrétaire général pour t'aider.";

export const WRONG_CREDENTIALS_ERROR_MESSAGE =
  "Nous ne pouvons pas t'effacer d'Overbookd.\nLe mot de passe et l'adresse mail ne correspondent pas";

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

export class WrongCrendentials extends ForgetMemberError {
  constructor() {
    super(WRONG_CREDENTIALS_ERROR_MESSAGE);
  }
}
