export class ContributionError extends Error {}

export const INSUFFICIENT_AMOUNT_ERROR_MESSAGE =
  "Le montant doit être supérieur ou égal à 1€";

export class InsufficientAmount extends ContributionError {
  constructor() {
    super(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
  }
}
