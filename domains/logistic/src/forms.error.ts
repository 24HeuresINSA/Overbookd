import { GearRequest } from "./gear-request";

class FormError extends Error {}

export class NotEnoughQuantity extends FormError {
  constructor() {
    const message = "❌ La quantité doit être au moins de 1";
    super(message);
  }
}

export class AlreadyAddedGear extends FormError {
  constructor(name: GearRequest["name"]) {
    const message = `❌ Le matos '${name}' a déjà été ajouté`;
    super(message);
  }
}
