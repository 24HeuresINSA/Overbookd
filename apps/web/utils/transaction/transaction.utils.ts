import { Money } from "@overbookd/money";
import {
  type MyTransaction,
  BARREL,
  PROVISIONS,
  DEPOSIT,
  EXTERNAL_EVENT,
  TRANSFER,
  SHARED_MEAL,
  INITIALIZATION,
  doIReceive,
  type TransactionType,
  isCredit,
} from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";
import {
  VIREMENT,
  DEPOT,
  FUT,
  PLACARD,
  INITIALISATION,
  REPAS_PARTAGE,
  EVENEMENT,
} from "./transaction.constants";

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
    case EXTERNAL_EVENT:
      return "mdi-party-popper";
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
    case EXTERNAL_EVENT:
      return "";
    case TRANSFER:
    case SHARED_MEAL:
      return doIReceive(transaction)
        ? `(de ${nicknameOrName(transaction.from)})`
        : `(vers ${nicknameOrName(transaction.to)})`;
  }
}

export function getTransactionTypeLabel(type: string): string {
  switch (type) {
    case TRANSFER:
      return VIREMENT;
    case DEPOSIT:
      return DEPOT;
    case BARREL:
      return FUT;
    case PROVISIONS:
      return PLACARD;
    case SHARED_MEAL:
      return REPAS_PARTAGE;
    case INITIALIZATION:
      return INITIALISATION;
    case EXTERNAL_EVENT:
      return EVENEMENT;
    default:
      return type;
  }
}

export function byMostRecent(a: MyTransaction, b: MyTransaction): number {
  return b.date.getTime() - a.date.getTime();
}
