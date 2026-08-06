export const DEFAULT_ERROR_MESSAGE =
  "Nous ne pouvons pas l'effacer d'Overbookd.\n";

export const HAS_FUTURE_ASSIGNMENT_ERROR_MESSAGE =
  DEFAULT_ERROR_MESSAGE + "Iel est affecté(e) à une tâche à venir.";

export const IN_DEBT_ERROR_MESSAGE =
  DEFAULT_ERROR_MESSAGE + "Iel a des dettes auprès de l'association.";

export const HAS_MONEY_ERROR_MESSAGE =
  DEFAULT_ERROR_MESSAGE + "Iel a de l'argent auprès de l'association.";

export class ForgetMemberError extends Error {}

export class HasFutureAssignment extends ForgetMemberError {
  constructor() {
    super(HAS_FUTURE_ASSIGNMENT_ERROR_MESSAGE);
  }
}

export class HasOpenSharedMeal extends ForgetMemberError {
  constructor(public readonly sharedMealDates: string[]) {
    super(
      DEFAULT_ERROR_MESSAGE +
        `Iel est inscrit(e) à des repas partagés non cloturés: ${sharedMealDates.join(", ")}.`,
    );
  }
}

export class HasTask extends ForgetMemberError {
  constructor(public readonly taskIds: number[]) {
    super(
      DEFAULT_ERROR_MESSAGE +
        `Iel est affecté(e) aux FT : #${taskIds.join(", #")}.`,
    );
  }
}

export class HasActivity extends ForgetMemberError {
  constructor(public readonly activityIds: number[]) {
    super(
      DEFAULT_ERROR_MESSAGE +
        `Iel est affecté(e) aux FA : #${activityIds.join(", #")}.`,
    );
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
