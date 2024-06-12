import { ContributionError } from "../contribution.error.js";

export const HAS_ALREADY_PAYED_ERROR_MESSAGE =
  "Le bénévole a déjà payé sa cotisation pour cette édition";

export const NOT_ALLOWED_TO_PAY_CONTRIBUTION_ERROR_MESSAGE =
  "Le bénévole n'est pas autorisé à payer la cotisation";

class PayContributionError extends ContributionError {}

export class HasAlreadyPayed extends PayContributionError {
  constructor() {
    super(HAS_ALREADY_PAYED_ERROR_MESSAGE);
  }
}

export class NotAllowedToPay extends PayContributionError {
  constructor() {
    super(NOT_ALLOWED_TO_PAY_CONTRIBUTION_ERROR_MESSAGE);
  }
}
