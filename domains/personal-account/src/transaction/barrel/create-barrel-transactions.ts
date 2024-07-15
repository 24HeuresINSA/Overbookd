import { ConfiguredBarrel } from "../../barrel-prices/define-barrel-price";
import { BARREL, MyBarrelTransaction, TransactionUser } from "../transaction";
import {
  AtLeastOneInsufficientConsumption,
  NoConsumer,
} from "./barrel-transaction.error";

type CreateBarrelTransaction = {
  consumer: number;
  consumption: number;
};

export type BarrelTransaction = MyBarrelTransaction & { from: TransactionUser };

export type BarrelTransactionForm = Omit<BarrelTransaction, "from"> & {
  from: number;
};

export type BarrelTransactions = {
  saveMany: (
    transactions: BarrelTransactionForm[],
  ) => Promise<BarrelTransaction[]>;
};

export class CreateBarrelTransactions {
  constructor(private readonly transactions: BarrelTransactions) {}

  async apply(
    barrel: ConfiguredBarrel,
    transactions: CreateBarrelTransaction[],
  ): Promise<BarrelTransaction[]> {
    if (transactions.length === 0) throw new NoConsumer();
    const insufficientConsumption = transactions.some(
      ({ consumption }) => consumption <= 0,
    );
    if (insufficientConsumption) throw new AtLeastOneInsufficientConsumption();

    const totalConsumption = transactions.reduce(
      (total, { consumption }) => total + consumption,
      0,
    );
    const newTransactions: BarrelTransactionForm[] = transactions.map(
      ({ consumer, consumption }) => {
        const context = this.defineContext(consumption, barrel);
        const amount = this.calculateAmount(
          consumption,
          totalConsumption,
          barrel,
        );
        return {
          context,
          amount,
          from: consumer,
          date: new Date(),
          type: BARREL,
        };
      },
    );
    return this.transactions.saveMany(newTransactions);
  }

  private calculateAmount(
    consumption: number,
    totalConsumption: number,
    barrel: ConfiguredBarrel,
  ): number {
    const floatConsumption = (barrel.price / totalConsumption) * consumption;
    return Math.ceil(floatConsumption);
  }

  private defineContext(consumption: number, barrel: ConfiguredBarrel): string {
    const stickWord = consumption > 1 ? "bâtons" : "bâton";
    const openedOn = this.formatDate(barrel.openedOn);
    return `Fût de ${barrel.drink} du ${openedOn}: ${consumption} ${stickWord}`;
  }

  private formatDate(date: Date): string {
    const displayOptions: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
    };
    return new Intl.DateTimeFormat("fr", displayOptions).format(date);
  }
}
