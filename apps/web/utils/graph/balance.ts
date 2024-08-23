import { Balance } from "@overbookd/personal-account";
import {
  isCredit,
  type MyTransaction,
  type TransactionsForBalance,
} from "@overbookd/personal-account";
import { Period } from "@overbookd/time";

type TransactionsByDate = { date: Date; transactions: TransactionsForBalance };
type BalanceByDate = { date: Date; balance: number };
const MAX_POINTS = 15;

function findTransactionsOn(
  period: Period,
  transactions: MyTransaction[],
): TransactionsByDate {
  const included = transactions.filter(({ date }) => period.isIncluding(date));
  const credit = included.filter(isCredit);
  const debit = included.filter((t) => !isCredit(t));
  return {
    date: period.start,
    transactions: { transactionsTo: credit, transactionsFrom: debit },
  };
}

function splitTimeRangeIntoPeriodsFrom(date: Date): Period[] {
  const timeRange = Period.init({ start: date, end: new Date() });
  return timeRange.splitInto(MAX_POINTS);
}

function calculateBalanceByPeriods(transactions: TransactionsByDate[]) {
  return transactions.reduce<BalanceByDate[]>((acc, { date, transactions }) => {
    const periodBalance = Balance.calculate(transactions);
    const previousBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
    const cumulativeBalance = previousBalance + periodBalance;
    return [...acc, { date, balance: cumulativeBalance }];
  }, []);
}

function calculateBalanceForEachTransaction(
  transactions: MyTransaction[],
): BalanceByDate[] {
  return transactions.reduce<BalanceByDate[]>((acc, transaction) => {
    const { date, amount } = transaction;
    const previousBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
    const realAmount = isCredit(transaction) ? amount : -amount;
    const cumulativeBalance = previousBalance + realAmount;
    return [...acc, { date, balance: cumulativeBalance }];
  }, []);
}

export function calculateBalanceByDates(
  transactions: MyTransaction[],
): BalanceByDate[] {
  const sortedTransactions = transactions.sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  if (sortedTransactions.length <= MAX_POINTS) {
    return calculateBalanceForEachTransaction(sortedTransactions);
  }

  const periods = splitTimeRangeIntoPeriodsFrom(sortedTransactions[0].date);
  const transactionsByPeriods = periods.map((period) =>
    findTransactionsOn(period, sortedTransactions),
  );
  return calculateBalanceByPeriods(transactionsByPeriods);
}
