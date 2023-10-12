import {
  TransferIReceiveTransaction,
  TransferISendTransaction,
} from "./transaction.model";

export function doIReceive(
  transfer: TransferIReceiveTransaction | TransferISendTransaction,
): transfer is TransferIReceiveTransaction {
  return "from" in transfer;
}
