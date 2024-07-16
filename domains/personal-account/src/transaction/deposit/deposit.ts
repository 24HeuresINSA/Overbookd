import { DEPOSIT, MyDepositTransaction, TransactionUser } from "../transaction";
import {
  AtLeastOneInsufficientAmount,
  InsufficientAmount,
} from "./deposit.error";

export type CreateDepositForm = {
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

  async apply({
    amount,
    depositor,
  }: CreateDepositForm): Promise<DepositTransaction> {
    if (amount <= 0) throw new InsufficientAmount();

    const deposit: DepositTransactionForm = {
      amount,
      to: depositor,
      context: "Recharge de compte perso",
      date: new Date(),
      type: DEPOSIT,
    };
    return this.deposits.save(deposit);
  }

  async applyMultiple(
    deposits: CreateDepositForm[],
  ): Promise<DepositTransaction[]> {
    const insufficientAmount = deposits.some(({ amount }) => amount <= 0);
    if (insufficientAmount) throw new AtLeastOneInsufficientAmount();
    return Promise.all(deposits.map((deposit) => this.apply(deposit)));
  }
}
