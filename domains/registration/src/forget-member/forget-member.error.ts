export const I_M_ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE =
  "Nous ne pouvons pas t'effacer d'Overbookd.\nTu es affecté à une tâche à venir.\nContacte les responsables bénévoles pour t'aider.";

export const ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel est affecté(e) à une tâche à venir.";

export const I_M_IN_DEBT_ERROR_MESSAGE =
  "Nous ne pouvons pas t'effacer d'Overbookd.\nTu as des dettes auprès de l'association.\nContacte le secrétaire général pour t'aider.";

export const IN_DEBT_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel a des dettes auprès de l'association.";

export const WRONG_CREDENTIALS_ERROR_MESSAGE =
  "Nous ne pouvons pas t'effacer d'Overbookd.\nLe mot de passe et l'adresse mail ne correspondent pas";

export const ALREADY_HAVE_TRANSACTIONS =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel a déjà effectué des transactions.";

export class ForgetMemberError extends Error {}

export class AssignedInFuturTask extends ForgetMemberError {
  constructor(isMyself: boolean = true) {
    const message = isMyself
      ? I_M_ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE
      : ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE;

    super(message);
  }
}

export class InDebt extends ForgetMemberError {
  constructor(isMyself: boolean = true) {
    const message = isMyself
      ? I_M_IN_DEBT_ERROR_MESSAGE
      : IN_DEBT_ERROR_MESSAGE;

    super(message);
  }
}

export class WrongCrendentials extends ForgetMemberError {
  constructor() {
    super(WRONG_CREDENTIALS_ERROR_MESSAGE);
  }
}

export class HaveTransactions extends ForgetMemberError {
  constructor() {
    super(ALREADY_HAVE_TRANSACTIONS);
  }
}
