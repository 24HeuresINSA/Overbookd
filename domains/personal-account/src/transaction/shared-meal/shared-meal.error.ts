const AMOUNT_TOO_HIGH_ERRROR_MESSAGE =
  "Le montant du repas partagé est trop élevé";

export class SharedMealError extends Error {}

export class AmountTooHigh extends SharedMealError {
  constructor() {
    super(AMOUNT_TOO_HIGH_ERRROR_MESSAGE);
  }
}
