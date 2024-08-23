import { GearRequest } from "./gear-request.js";

export class LogisticError extends Error {}

export class NotEnoughQuantity extends LogisticError {
  constructor() {
    const message = "La quantité doit être au moins de 1";
    super(message);
  }
}

export class AlreadyAddedGear extends LogisticError {
  constructor(name: GearRequest["name"]) {
    const message = `Le matos '${name}' a déjà été ajouté`;
    super(message);
  }
}
