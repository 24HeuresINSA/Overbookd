import { User } from "../transaction.model";

export type MyTransfer = {
  id: number;
  amount: number;
  to: User;
  context: string;
  createdAt: Date;
};

export type CreateTransferForm = {
  to: number;
  amount: number;
  context: string;
};

export type TransferForm = CreateTransferForm & {
  from: number;
};
