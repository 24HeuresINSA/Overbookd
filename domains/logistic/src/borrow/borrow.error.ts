import { Borrow } from "./borrow";

class BorrowError extends Error {}

export class BorrowNotFound extends BorrowError {
  constructor(id: Borrow["id"]) {
    const message = `❌ La fiche emprunt #${id} n'a pas été trouvée`;
    super(message);
  }
}

export class AvailableDateAfterUnavailableDate extends BorrowError {
  constructor() {
    const message =
      "❌ La date de mise à disposition doit être avant la date de restitution";
    super(message);
  }
}
