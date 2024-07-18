export const SELECT_TRANSACTIONS_FOR_BALANCE = {
  transactionsFrom: { select: { amount: true } },
  transactionsTo: { select: { amount: true } },
};

export type WithTransactionsForBalance = {
  transactionsFrom: { amount: number }[];
  transactionsTo: { amount: number }[];
};
