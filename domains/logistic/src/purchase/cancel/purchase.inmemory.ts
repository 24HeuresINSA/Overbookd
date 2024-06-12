import { Purchase } from "../purchase.js";

export class InMemoryPurchases {
  constructor(private purchases: Purchase[] = []) {}

  remove(id: Purchase["id"]): Promise<void> {
    this.purchases = this.purchases.filter((purchase) => purchase.id !== id);
    return Promise.resolve();
  }

  get all(): Purchase[] {
    return this.purchases;
  }
}
