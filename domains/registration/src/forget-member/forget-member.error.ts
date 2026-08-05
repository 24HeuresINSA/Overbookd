export const HAS_FUTURE_ASSIGNMENT_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel est affecté(e) à une tâche à venir.";

export const HAS_TASK_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel est affecté(e) à une FT.";

export const HAS_ACTIVITY_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel est affecté(e) à une FA.";

export const IN_DEBT_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel a des dettes auprès de l'association.";

export const HAS_MONEY_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\nIel a de l'argent auprès de l'association.";

export class ForgetMemberError extends Error {}

export class HasFutureAssignment extends ForgetMemberError {
  constructor() {
    super(HAS_FUTURE_ASSIGNMENT_ERROR_MESSAGE);
  }
}

export class HasTask extends ForgetMemberError {
  constructor() {
    super(HAS_TASK_ERROR_MESSAGE);
  }
}

export class HasActivity extends ForgetMemberError {
  constructor() {
    super(HAS_ACTIVITY_ERROR_MESSAGE);
  }
}

export class InDebt extends ForgetMemberError {
  constructor() {
    super(IN_DEBT_ERROR_MESSAGE);
  }
}

export class HasMoney extends ForgetMemberError {
  constructor() {
    super(HAS_MONEY_ERROR_MESSAGE);
  }
}
