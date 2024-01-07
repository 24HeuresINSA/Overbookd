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

type ReceiveOrSendTransaction = typeof SHARED_MEAL | typeof TRANSFER;

type Send<T extends ReceiveOrSendTransaction> = BaseTransaction & {
  type: T;
  to: TransactionUser;
};

type Receive<T extends ReceiveOrSendTransaction> = BaseTransaction & {
  type: T;
  from: TransactionUser;
};

export type TransactionUser = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
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

export type TransferIReceiveTransaction = Receive<typeof TRANSFER>;

export type TransferISendTransaction = Send<typeof TRANSFER>;

type SharedMealIOfferTransaction = Receive<typeof SHARED_MEAL>;

type SharedMealIShotgunTransaction = Send<typeof SHARED_MEAL>;

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

export function doIReceive<T extends ReceiveOrSendTransaction>(
  transfer: Receive<T> | Send<T>,
): transfer is Receive<T> {
  return "from" in transfer;
}
