type BaseTransaction = {
  amount: number;
  context: string;
  createdAt: Date;
  isDeleted: boolean;
};

export type Barrel = BaseTransaction & {
  type: "BARREL";
  from: string;
  to: null;
};

export type Provisions = BaseTransaction & {
  type: "PROVISIONS";
  from: string;
  to: null;
};

export type Deposit = BaseTransaction & {
  type: "DEPOSIT";
  from: string;
  to: null;
};

export type Transfer = BaseTransaction & {
  type: "TRANSFER";
  from: number;
  to: number;
};

export type Transaction = Barrel | Provisions | Deposit | Transfer;
