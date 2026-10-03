export class LogisticError extends Error {}

export class NotEnoughQuantity extends LogisticError {
  constructor() {
    const message = "La quantité doit être au moins de 1";
    super(message);
  }
}

export class GearNotFound extends LogisticError {
  constructor(id: number) {
    super(`Le matos #${id} n'existe pas`);
  }
}
