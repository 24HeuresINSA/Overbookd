import { TransactionError } from "../transaction.error";

const INSUFFICIENT_STICK_PRICE_ERROR_MESSAGE =
  "Le prix du bâton doit être supérieur à 0";

export class InsufficientStickPrice extends TransactionError {
  constructor() {
    super(INSUFFICIENT_STICK_PRICE_ERROR_MESSAGE);
  }
}
