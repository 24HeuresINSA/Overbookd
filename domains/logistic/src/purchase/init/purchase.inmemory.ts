import { Purchase } from "../purchase.js";
import { PurchasesForInit } from "./init.js";

export class InMemoryPurchases implements PurchasesForInit {
  constructor(private purchases: Purchase[] = []) {}

  add(purchase: Purchase): Promise<Purchase> {
    this.purchases = [...this.purchases, purchase];
    return Promise.resolve(purchase);
  }

  get all(): Purchase[] {
    return this.purchases;
  }
}
