import { IS_NOT_DELETED } from "./not-deleted.query";

const SELECT_TRANSACTIONS = {
  select: { amount: true },
  where: IS_NOT_DELETED,
};

export const SELECT_TRANSACTIONS_FOR_BALANCE = {
  transactionsFrom: SELECT_TRANSACTIONS,
  transactionsTo: SELECT_TRANSACTIONS,
};

export type WithTransactionsForBalance = {
  transactionsFrom: { amount: number }[];
  transactionsTo: { amount: number }[];
};
