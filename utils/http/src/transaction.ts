import { MyTransaction } from "@overbookd/personal-account";

export type CreateTransactionForm = {
  amount: MyTransaction["amount"];
  type: MyTransaction["type"];
  context: MyTransaction["context"];
  to: number;
  from: number;
};
