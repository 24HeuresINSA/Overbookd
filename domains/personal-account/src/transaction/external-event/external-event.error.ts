import {
  AT_LEAST_ONE_INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  TransactionError,
} from "../transaction.error";

class ExternalEventError extends TransactionError {}

export class InsufficientAmount extends ExternalEventError {
  constructor() {
    super(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
  }
}

export class AtLeastOneInsufficientAmount extends ExternalEventError {
  constructor() {
    super(AT_LEAST_ONE_INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
  }
}
