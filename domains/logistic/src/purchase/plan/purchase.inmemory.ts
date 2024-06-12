import { Purchase } from "../purchase.js";
import { PurchasesForPlan } from "./plan.js";

export class InMemoryPurchases implements PurchasesForPlan {
  constructor(private purchases: Purchase[] = []) {}

  find(id: Purchase["id"]): Promise<Purchase | undefined> {
    return Promise.resolve(
      this.purchases.find((purchase) => purchase.id === id),
    );
  }

  save(update: Purchase): Promise<Purchase> {
    this.purchases = this.purchases.map((purchase) =>
      purchase.id === update.id ? update : purchase,
    );
    return Promise.resolve(update);
  }

  get all(): Purchase[] {
    return this.purchases;
  }
}
