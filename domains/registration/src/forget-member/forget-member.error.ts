export const ASSIGNED_IN_FUTUR_TASK_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel est affecté(e) à une tâche à venir.";

export const IN_DEBT_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel a des dettes auprès de l'association.";

export class ForgetMemberError extends Error {}

export class AssignedInFuturTask extends ForgetMemberError {
  constructor() {
    super(ASSIGNED_IN_FUTUR_TASK_ERROR_MESSAGE);
  }
}

export class InDebt extends ForgetMemberError {
  constructor() {
    super(IN_DEBT_ERROR_MESSAGE);
  }
}
