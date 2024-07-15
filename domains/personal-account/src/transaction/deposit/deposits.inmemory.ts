import { MyTransaction, TransactionUser } from "../transaction";
import {
  Deposits,
  DepositTransaction,
  DepositTransactionForm,
} from "./deposit";

export class InMemoryDeposits implements Deposits {
  constructor(
    private adherents: TransactionUser[],
    private deposits: MyTransaction[],
  ) {}

  save(deposit: DepositTransactionForm): Promise<DepositTransaction> {
    const to = this.adherents.find((adherent) => adherent.id === deposit.to);
    if (!to) throw new Error(`Utilisateur #${deposit.to} introuvable`);

    const newDeposit: DepositTransaction = { ...deposit, to };

    this.deposits = [...this.deposits, newDeposit];
    return Promise.resolve(newDeposit);
  }

  get all(): MyTransaction[] {
    return this.deposits;
  }
}
