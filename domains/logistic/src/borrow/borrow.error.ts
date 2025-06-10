import { LogisticError } from "../logistic.error.js";
import { Borrow } from "./borrow.js";

export class BorrowError extends LogisticError {}

export class BorrowNotFound extends BorrowError {
  constructor(id: Borrow["id"]) {
    const message = `La fiche emprunt #${id} n'a pas été trouvée`;
    super(message);
  }
}

export class NoDuration extends BorrowError {
  constructor() {
    const message = "Le créneau doit avoir une durée";
    super(message);
  }
}
