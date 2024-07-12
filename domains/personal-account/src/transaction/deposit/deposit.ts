import {
  DEPOSIT,
  MyDepositTransaction,
  TransactionUser,
} from "../transaction.model";

type CreateDepositForm = {
  amount: number;
  depositor: number;
};

export type DepositTransaction = MyDepositTransaction & { to: TransactionUser };

export type DepositTransactionForm = Omit<DepositTransaction, "to"> & {
  to: number;
};

export type Deposits = {
  save: (deposit: DepositTransactionForm) => Promise<DepositTransaction>;
};

export class Deposit {
  constructor(private readonly deposits: Deposits) {}

  apply({ amount, depositor }: CreateDepositForm): Promise<DepositTransaction> {
    const deposit: DepositTransactionForm = {
      amount,
      to: depositor,
      context: "Recharge de compte perso",
      date: new Date(),
      type: DEPOSIT,
    };
    return this.deposits.save(deposit);
  }

  applyMultiple(
    deposits: CreateDepositForm[],
  ): Promise<MyDepositTransaction[]> {
    return Promise.all(deposits.map((deposit) => this.apply(deposit)));
  }
}
