import { TransactionError } from "../transaction.error";

class BarrelTransactionError extends TransactionError {}

const NO_CONSUMER_ERROR_MESSAGE = "Aucun consommateur n'est renseigné";

const AT_LEAST_ONE_INSUFFICIENT_CONSUMPTION_ERROR_MESSAGE =
  "Au moins une consommation n'est pas supérieur à 0";

export class NoConsumer extends BarrelTransactionError {
  constructor() {
    super(NO_CONSUMER_ERROR_MESSAGE);
  }
}

export class AtLeastOneInsufficientConsumption extends BarrelTransactionError {
  constructor() {
    super(AT_LEAST_ONE_INSUFFICIENT_CONSUMPTION_ERROR_MESSAGE);
  }
}
