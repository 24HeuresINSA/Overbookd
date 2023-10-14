export const DEPOSIT = "DEPOSIT";
export const BARREL = "BARREL";
export const PROVISIONS = "PROVISIONS";
export const TRANSFER = "TRANSFER";
export const SHARED_MEAL = "SHARED_MEAL";

type BaseTransaction = {
  amount: number;
  context: string;
  date: Date;
};

export type DepositTransaction = BaseTransaction & {
  type: typeof DEPOSIT;
};

export type BarrelTransaction = BaseTransaction & {
  type: typeof BARREL;
};

export type ProvisionsTransaction = BaseTransaction & {
  type: typeof PROVISIONS;
};

export type TransferIReceiveTransaction = BaseTransaction & {
  type: typeof TRANSFER;
  from: number;
};

export type TransferISendTransaction = BaseTransaction & {
  type: typeof TRANSFER;
  to: number;
};

type SharedMealIOfferTransaction = BaseTransaction & {
  type: typeof SHARED_MEAL;
  from: number;
};

type SharedMealIShotgunTransaction = BaseTransaction & {
  type: typeof SHARED_MEAL;
  to: number;
};

export type Transaction =
  | DepositTransaction
  | BarrelTransaction
  | ProvisionsTransaction
  | TransferIReceiveTransaction
  | TransferISendTransaction
  | SharedMealIOfferTransaction
  | SharedMealIShotgunTransaction;

export type TransactionType = Transaction["type"];

export const transactionTypes: TransactionType[] = [
  DEPOSIT,
  BARREL,
  PROVISIONS,
  TRANSFER,
  SHARED_MEAL,
];

export function doIReceive(
  transfer: TransferIReceiveTransaction | TransferISendTransaction,
): transfer is TransferIReceiveTransaction {
  return "from" in transfer;
}
