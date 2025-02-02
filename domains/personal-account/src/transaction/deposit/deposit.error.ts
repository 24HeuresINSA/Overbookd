import {
  AT_LEAST_ONE_INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  TransactionError,
} from "../transaction.error";

class DepositError extends TransactionError {}

export class InsufficientAmount extends DepositError {
  constructor() {
    super(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
  }
}

export class AtLeastOneInsufficientAmount extends DepositError {
  constructor() {
    super(AT_LEAST_ONE_INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
  }
}
