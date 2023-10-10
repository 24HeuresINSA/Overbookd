interface BaseTransaction {
  amount: number;
  context: string;
  createdAt: Date;
  isDeleted: boolean;
}

export interface Barrel extends BaseTransaction {
  type: "BARREL";
  from: string;
  to: null;
}

export interface Provisions extends BaseTransaction {
  type: "PROVISIONS";
  from: string;
  to: null;
}

export interface Deposit extends BaseTransaction {
  type: "DEPOSIT";
  from: string;
  to: null;
}

export interface Transfer extends BaseTransaction {
  type: "TRANSFER";
  from: number;
  to: number;
}

export type Transaction = Barrel | Provisions | Deposit | Transfer;
