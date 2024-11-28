export class TransactionError extends Error {}

const NO_CONSUMER_ERROR_MESSAGE = "Aucun consommateur n'est renseigné";

const AT_LEAST_ONE_INSUFFICIENT_CONSUMPTION_ERROR_MESSAGE =
  "Au moins une consommation n'est pas supérieur à 0";

export const INSUFFICIENT_AMOUNT_ERROR_MESSAGE =
  "Le montant doit être supérieur à 0";

export const AT_LEAST_ONE_INSUFFICIENT_AMOUNT_ERROR_MESSAGE =
  "Au moins un montant n'est pas supérieur à 0";

export class NoConsumer extends TransactionError {
  constructor() {
    super(NO_CONSUMER_ERROR_MESSAGE);
  }
}

export class AtLeastOneInsufficientConsumption extends TransactionError {
  constructor() {
    super(AT_LEAST_ONE_INSUFFICIENT_CONSUMPTION_ERROR_MESSAGE);
  }
}
