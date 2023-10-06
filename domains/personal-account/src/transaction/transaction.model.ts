export type User = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

export type Transaction =  {
  id: number;
  amount: number;
  to: User;
  from: User;
  context: string;
  type: TransactionType;
  createdAt: Date;
};

const TRANSFER = "TRANSFER";
const DEPOSIT = "DEPOSIT";
const BARREL = "BARREL";
const PROVISIONS = "PROVISIONS";
const EVENT = "EVENT";
const OTHER = "OTHER";

export const transactionTypes: Record<TransactionType, TransactionType> = {
  TRANSFER,
  DEPOSIT,
  BARREL,
  PROVISIONS,
  EVENT,
  OTHER,
};

export type TransactionType =
  | typeof TRANSFER
  | typeof DEPOSIT
  | typeof BARREL
  | typeof PROVISIONS
  | typeof EVENT
  | typeof OTHER;
