import User from "@overbookd/user";

export type MyTransaction = {
  id: number;
  amount: number;
  to: User;
  context: string;
  createdAt: Date;
};

export type Transaction = MyTransaction & {
  from: User;
};
