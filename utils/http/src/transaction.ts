import { Transaction } from "@overbookd/personal-account";

export type CreateTransactionForm = {
  amount: Transaction["amount"];
  type: Transaction["type"];
  context: Transaction["context"];
  to: number;
  from: number;
};
