export type User = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

export type MyTransfer = {
  id: number;
  amount: number;
  to: User;
  context: string;
  createdAt: Date;
};

export type Transaction = MyTransfer & {
  from: User;
  type: TransactionType;
};

const TRANSFER = "TRANSFER";
const DEPOSIT = "DEPOSIT";
const BARREL = "BARREL";
const EVENT = "EVENT";
const OTHER = "OTHER";

export const transactionTypes: Record<TransactionType, TransactionType> = {
  TRANSFER,
  DEPOSIT,
  BARREL,
  EVENT,
  OTHER,
};

export type TransactionType =
  | typeof TRANSFER
  | typeof DEPOSIT
  | typeof BARREL
  | typeof EVENT
  | typeof OTHER;
