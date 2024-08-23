import { LogisticError } from "../logistic.error.js";
import { Borrow } from "./borrow.js";

class BorrowError extends LogisticError {}

export class BorrowNotFound extends BorrowError {
  constructor(id: Borrow["id"]) {
    const message = `La fiche emprunt #${id} n'a pas été trouvée`;
    super(message);
  }
}
