export const HAS_ALREADY_PAYED_ERROR_MESSAGE =
  "Le bénévole a déjà payé sa cotisation pour cette édition";

export const INSUFFICIENT_AMOUNT_ERROR_MESSAGE =
  "Le montant doit être supérieur ou égal à 1€";

export const NOT_ALLOWED_TO_PAY_CONTRIBUTION_ERROR_MESSAGE =
  "Le bénévole n'est pas autorisé à payer la cotisation";

class PayContributionError extends Error {}

export class HasAlreadyPayed extends PayContributionError {
  constructor() {
    super(HAS_ALREADY_PAYED_ERROR_MESSAGE);
  }
}

export class InsufficientAmount extends PayContributionError {
  constructor() {
    super(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
  }
}

export class NotAllowedToPay extends PayContributionError {
  constructor() {
    super(NOT_ALLOWED_TO_PAY_CONTRIBUTION_ERROR_MESSAGE);
  }
}
