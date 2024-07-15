import { TransactionError } from "../transaction.error";

class DepositError extends TransactionError {}

const INSUFFICIENT_AMOUNT_ERROR_MESSAGE = "Le montant doit être supérieur à 0";

const AT_LEAST_ONE_INSUFFICIENT_AMOUNT_ERROR_MESSAGE =
  "Au moins un montant n'est pas supérieur à 0";

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
