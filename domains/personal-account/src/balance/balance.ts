type Transaction = {
  amount: number;
};

export type TransactionsForBalance = {
  transactionsFrom: Transaction[];
  transactionsTo: Transaction[];
};

export class Balance {
  static calculate({
    transactionsFrom,
    transactionsTo,
  }: TransactionsForBalance) {
    const benefit = transactionsTo.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
    const expense = transactionsFrom.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
    return benefit - expense;
  }
}
