import { Money } from "@overbookd/money";
import {
  type MyTransaction,
  BARREL,
  PROVISIONS,
  DEPOSIT,
  TRANSFER,
  SHARED_MEAL,
  INITIALIZATION,
  doIReceive,
  type TransactionType,
} from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";

export function isCredit(transaction: MyTransaction): boolean {
  switch (transaction.type) {
    case BARREL:
    case PROVISIONS:
      return false;
    case DEPOSIT:
      return true;
    case TRANSFER:
    case SHARED_MEAL:
    case INITIALIZATION:
      return doIReceive(transaction);
  }
}

export function isDebit(transaction: MyTransaction): boolean {
  return !isCredit(transaction);
}

export function getTransactionIcon(type: TransactionType): string {
  switch (type) {
    case BARREL:
      return "mdi-glass-mug-variant";
    case DEPOSIT:
      return "mdi-transfer";
    case PROVISIONS:
      return "mdi-food";
    case TRANSFER:
      return "mdi-swap-vertical";
    case SHARED_MEAL:
      return "mdi-food-variant";
    case INITIALIZATION:
      return "mdi-restart";
  }
}

export function formatAmount(transaction: MyTransaction): string {
  const symbol = isDebit(transaction) ? "-" : "";
  return `${symbol}${Money.cents(transaction.amount).toString()}`;
}

export function getTransferMessage(transaction: MyTransaction): string {
  switch (transaction.type) {
    case BARREL:
    case PROVISIONS:
    case DEPOSIT:
    case INITIALIZATION:
      return "";
    case TRANSFER:
    case SHARED_MEAL:
      return doIReceive(transaction)
        ? `(de ${nicknameOrName(transaction.from)})`
        : `(vers ${nicknameOrName(transaction.to)})`;
  }
}
