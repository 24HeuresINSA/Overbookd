import { MyTransaction, TransactionUser } from "../transaction";
import {
  BarrelTransaction,
  BarrelTransactionForm,
  BarrelTransactions,
} from "./create-barrel-transactions";

export class InMemoryBarrelTransactions implements BarrelTransactions {
  constructor(
    private adherents: TransactionUser[],
    private transactions: MyTransaction[],
  ) {}

  saveMany(
    transactions: BarrelTransactionForm[],
  ): Promise<BarrelTransaction[]> {
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
