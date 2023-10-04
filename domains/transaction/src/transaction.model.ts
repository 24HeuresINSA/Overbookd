export type User = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

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
