import { numberGenerator } from "@overbookd/list";
import { Purchase } from "../purchase";

export type InitPurchaseForm = {
  seller: string;
  availableOn: Date;
};

export type PurchasesForInit = {
  add(purchase: Purchase): Promise<Purchase>;
};

export class InitPurchase {
  private idGenerator: Generator<number> = numberGenerator(1);

  constructor(private readonly purchases: PurchasesForInit) {}

  async apply(form: InitPurchaseForm): Promise<Purchase> {
    const purchase = {
      ...form,
      id: this.generateId(),
      gears: [],
    };
    return this.purchases.add(purchase);
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}
