export const DEPOSIT = "DEPOSIT";
export const BARREL = "BARREL";
export const PROVISIONS = "PROVISIONS";
export const TRANSFER = "TRANSFER";
export const SHARED_MEAL = "SHARED_MEAL";
export const INITIALIZATION = "INITIALIZATION";

export const ONE_EURO_IN_CENTS = 100;

type BaseTransaction = {
  amount: number;
  context: string;
  date: Date;
};

type ReceiveOrSendTransaction =
  | typeof SHARED_MEAL
  | typeof TRANSFER
  | typeof INITIALIZATION;

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

export type MyDepositTransaction = BaseTransaction & {
  type: typeof DEPOSIT;
};

export type MyBarrelTransaction = BaseTransaction & {
  type: typeof BARREL;
};

export type MyProvisionsTransaction = BaseTransaction & {
  type: typeof PROVISIONS;
};

export type TransferIReceiveTransaction = Receive<typeof TRANSFER>;

export type TransferISendTransaction = Send<typeof TRANSFER>;

type SharedMealIOfferTransaction = Receive<typeof SHARED_MEAL>;

type SharedMealIShotgunTransaction = Send<typeof SHARED_MEAL>;

export type MyPositiveInitializationTransaction = Receive<
  typeof INITIALIZATION
>;

export type MyNegativeInitializationTransaction = Send<typeof INITIALIZATION>;

export type MyTransaction =
  | MyDepositTransaction
  | MyBarrelTransaction
  | MyProvisionsTransaction
  | TransferIReceiveTransaction
  | TransferISendTransaction
  | SharedMealIOfferTransaction
  | SharedMealIShotgunTransaction
  | MyPositiveInitializationTransaction
  | MyNegativeInitializationTransaction;

export type TransactionType = MyTransaction["type"];

export const transactionTypes: TransactionType[] = [
  DEPOSIT,
  BARREL,
  PROVISIONS,
  TRANSFER,
  SHARED_MEAL,
];

export type TransactionWithSenderAndReceiver = BaseTransaction & {
  id: number;
  type: TransactionType;
  isDeleted: boolean;
  payor?: TransactionUser;
  payee?: TransactionUser;
};

export function doIReceive<T extends ReceiveOrSendTransaction>(
  transfer: Receive<T> | Send<T>,
): transfer is Receive<T> {
  return "from" in transfer;
}
