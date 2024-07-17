type Transaction = {
  amount: number;
};

export class Balance {
  static calculate(
    transactionsIReceived: Transaction[],
    transactionsISent: Transaction[],
  ) {
    const benefit = transactionsIReceived.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
    const expense = transactionsISent.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
    return benefit - expense;
  }
}
