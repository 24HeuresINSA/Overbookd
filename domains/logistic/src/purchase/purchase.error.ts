import { LogisticError } from "../logistic.error";
import { Purchase } from "./purchase";

class PurchaseError extends LogisticError {}

export class PurchaseNotFound extends PurchaseError {
  constructor(id: Purchase["id"]) {
    const message = `❌ La fiche achat #${id} n'a pas été trouvée`;
    super(message);
  }
}
