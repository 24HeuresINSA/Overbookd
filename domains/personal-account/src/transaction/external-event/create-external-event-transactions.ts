import {
  EXTERNAL_EVENT,
  MyExternalEventTransaction,
  TransactionUser,
} from "../transaction";
import {
  AtLeastOneInsufficientAmount,
  InsufficientAmount,
} from "./external-event.error";

export type NewExternalEventConsumption = {
  amount: number;
  consumer: number;
  context: string;
};

export type ExternalEventTransaction = MyExternalEventTransaction & {
  from: TransactionUser;
};

export type ExternalEventTransactionForm = Omit<
  ExternalEventTransaction,
  "from"
> & {
  from: number;
};

export type ExternalEventTransactions = {
  save: (
    transaction: ExternalEventTransactionForm,
  ) => Promise<ExternalEventTransaction>;
};

export class CreateExternalEventTransactions {
  constructor(
    private readonly externalEventTransactions: ExternalEventTransactions,
  ) {}

  async apply(
    consumption: NewExternalEventConsumption,
  ): Promise<ExternalEventTransaction> {
    const { amount, consumer, context } = consumption;
    if (amount <= 0) throw new InsufficientAmount();

    const transaction: ExternalEventTransactionForm = {
      amount,
      from: consumer,
      context,
      date: new Date(),
      type: EXTERNAL_EVENT,
    };
    return this.externalEventTransactions.save(transaction);
  }

  async applyMultiple(
    consumptions: NewExternalEventConsumption[],
  ): Promise<ExternalEventTransaction[]> {
    const insufficientAmount = consumptions.some(({ amount }) => amount <= 0);
    if (insufficientAmount) throw new AtLeastOneInsufficientAmount();
    return Promise.all(
      consumptions.map((consumption) => this.apply(consumption)),
    );
  }
}
