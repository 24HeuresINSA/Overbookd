export const HAS_ALREADY_PAYED_ERROR_MESSAGE =
  "Le bénévole a déjà payé sa cotisation pour cette édition";

export const INSUFFICIENT_AMOUNT_ERROR_MESSAGE = "Le montant doit être supérieur ou égal à 1€";

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
