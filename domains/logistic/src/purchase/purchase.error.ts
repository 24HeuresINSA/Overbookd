import { Purchase } from "./purchase";

class PurchaseError extends Error {}

export class PurchaseNotFound extends PurchaseError {
  constructor(id: Purchase["id"]) {
    const message = `❌ La fiche achat #${id} n'a pas été trouvée`;
    super(message);
  }
}
