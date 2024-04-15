import { Purchase } from "../purchase";

export type PurchasesForCancel = {
  remove(id: Purchase["id"]): void;
};

export class CancelPurchase {
  constructor(private readonly purchases: PurchasesForCancel) {}

  async apply(id: Purchase["id"]): Promise<void> {
    return this.purchases.remove(id);
  }
}
