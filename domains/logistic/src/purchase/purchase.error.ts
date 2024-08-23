import { LogisticError } from "../logistic.error.js";
import { Purchase } from "./purchase.js";

class PurchaseError extends LogisticError {}

export class PurchaseNotFound extends PurchaseError {
  constructor(id: Purchase["id"]) {
    const message = `La fiche achat #${id} n'a pas été trouvée`;
    super(message);
  }
}
