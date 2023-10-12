type BaseTransaction = {
  amount: number;
  context: string;
  date: Date;
};

type DepositTransaction = BaseTransaction & {
  type: "DEPOSIT";
};

type BarrelTransaction = BaseTransaction & {
  type: "BARREL";
};

type ProvisionsTransaction = BaseTransaction & {
  type: "PROVISIONS";
};

export type TransferIReceiveTransaction = BaseTransaction & {
  type: "TRANSFER";
  from: number;
};

export type TransferISendTransaction = BaseTransaction & {
  type: "TRANSFER";
  to: number;
};

export type Transaction =
  | DepositTransaction
  | BarrelTransaction
  | ProvisionsTransaction
  | TransferIReceiveTransaction
  | TransferISendTransaction;

export type TransactionType = Transaction["type"];
