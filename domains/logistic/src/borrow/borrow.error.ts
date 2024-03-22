import { Borrow, GearRequest } from "./borrow";

export class BorrowError extends Error {}

export class BorrowNotFound extends BorrowError {
  constructor(id: Borrow["id"]) {
    const message = `❌ La fiche emprunt #${id} n'a pas été trouvée`;
    super(message);
  }
}

export class NotEnoughQuantity extends BorrowError {
  constructor() {
    const message = "❌ La quantité doit être au moins de 1";
    super(message);
  }
}

export class AlreadyAddedGear extends BorrowError {
  constructor(name: GearRequest["name"]) {
    const message = `❌ Le matos '${name}' a déjà été ajouté`;
    super(message);
  }
}
