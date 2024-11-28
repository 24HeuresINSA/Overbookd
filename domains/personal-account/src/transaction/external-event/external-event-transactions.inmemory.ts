import { MyTransaction, TransactionUser } from "../transaction";
import {
  ExternalEventTransactions,
  ExternalEventTransaction,
  ExternalEventTransactionForm,
} from "./create-external-event-transactions";

export class InMemoryExternalEventTransactions
  implements ExternalEventTransactions
{
  constructor(
    private adherents: TransactionUser[],
    private externalEventTransactions: MyTransaction[],
  ) {}

  save(
    transaction: ExternalEventTransactionForm,
  ): Promise<ExternalEventTransaction> {
    const from = this.adherents.find(
      (adherent) => adherent.id === transaction.from,
    );
    if (!from) throw new Error(`Utilisateur #${transaction.from} introuvable`);

    const newExternalEventTransaction: ExternalEventTransaction = {
      ...transaction,
      from,
    };

    this.externalEventTransactions = [
      ...this.externalEventTransactions,
      newExternalEventTransaction,
    ];
    return Promise.resolve(newExternalEventTransaction);
  }

  get all(): MyTransaction[] {
    return this.externalEventTransactions;
  }
}
