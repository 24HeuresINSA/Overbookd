export const DEPOSIT = "DEPOSIT";
export const BARREL = "BARREL";
export const PROVISIONS = "PROVISIONS";
export const TRANSFER = "TRANSFER";

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

export type Transaction =
  | DepositTransaction
  | BarrelTransaction
  | ProvisionsTransaction
  | TransferIReceiveTransaction
  | TransferISendTransaction;

export type TransactionType = Transaction["type"];

export const transactionTypes: TransactionType[] = [
  DEPOSIT,
  BARREL,
  PROVISIONS,
  TRANSFER,
];

export function doIReceive(
  transfer: TransferIReceiveTransaction | TransferISendTransaction,
): transfer is TransferIReceiveTransaction {
  return "from" in transfer;
}
