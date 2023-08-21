interface BaseTransaction {
  amount: number;
  context: string;
  createdAt: Date;
  isDeleted: boolean;
}

export interface Expense extends BaseTransaction {
  type: 'EXPENSE';
  from: string;
  to: null;
}

export interface Deposit extends BaseTransaction {
  type: 'DEPOSIT';
  from: string;
  to: null;
}

export interface Transfer extends BaseTransaction {
  type: 'TRANSFER';
  from: number;
  to: number;
}

export type Transaction = Expense | Deposit | Transfer;
