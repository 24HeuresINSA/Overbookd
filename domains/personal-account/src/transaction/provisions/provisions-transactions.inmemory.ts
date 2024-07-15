import { MyTransaction, TransactionUser } from "../transaction";
import {
  ProvisionsTransaction,
  ProvisionsTransactionForm,
  ProvisionsTransactions,
} from "./create-provisions-transactions";

export class InMemoryProvisionsTransactions implements ProvisionsTransactions {
  constructor(
    private adherents: TransactionUser[],
    private transactions: MyTransaction[],
  ) {}

  saveMany(
    transactions: ProvisionsTransactionForm[],
  ): Promise<ProvisionsTransaction[]> {
    const newTransactions = transactions.map((transaction) => {
      const adherent = this.adherents.find(
        (adherent) => adherent.id === transaction.from,
      );
      if (!adherent)
        throw new Error(`Utilisateur #${transaction.from} introuvable`);
      return { ...transaction, from: adherent };
    });
    this.transactions = [...this.transactions, ...newTransactions];
    return Promise.resolve(newTransactions);
  }

  get all(): MyTransaction[] {
    return this.transactions;
  }
}
