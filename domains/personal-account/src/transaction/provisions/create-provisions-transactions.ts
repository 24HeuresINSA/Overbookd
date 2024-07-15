import {
  MyProvisionsTransaction,
  PROVISIONS,
  TransactionUser,
} from "../transaction";
import {
  AtLeastOneInsufficientConsumption,
  NoConsumer,
} from "../transaction.error";
import { InsufficientStickPrice } from "./provisions.error";

type CreateProvisionsTransaction = {
  consumer: number;
  consumption: number;
};

export type ProvisionsTransaction = MyProvisionsTransaction & {
  from: TransactionUser;
};

export type ProvisionsTransactionForm = Omit<ProvisionsTransaction, "from"> & {
  from: number;
};

export type ProvisionsTransactions = {
  saveMany: (
    transactions: ProvisionsTransactionForm[],
  ) => Promise<ProvisionsTransaction[]>;
};

export class CreateProvisionsTransactions {
  constructor(private readonly transactions: ProvisionsTransactions) {}

  async apply(
    stickPrice: number,
    transactions: CreateProvisionsTransaction[],
  ): Promise<ProvisionsTransaction[]> {
    if (stickPrice <= 0) throw new InsufficientStickPrice();

    if (transactions.length === 0) throw new NoConsumer();
    const insufficientConsumption = transactions.some(
      ({ consumption }) => consumption <= 0,
    );
    if (insufficientConsumption) throw new AtLeastOneInsufficientConsumption();

    const newTransactions: ProvisionsTransactionForm[] = transactions.map(
      ({ consumer, consumption }) => ({
        context: this.defineContext(consumption),
        amount: stickPrice * consumption,
        from: consumer,
        date: new Date(),
        type: PROVISIONS,
      }),
    );
    return this.transactions.saveMany(newTransactions);
  }

  private defineContext(consumption: number) {
    const stickWord = consumption > 1 ? "bâtons" : "bâton";
    return `Conso placard: ${consumption} ${stickWord}`;
  }
}
