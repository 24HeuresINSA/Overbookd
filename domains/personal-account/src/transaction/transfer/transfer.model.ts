export type CreateTransferForm = {
  to: number;
  amount: number;
  context: string;
};

export type TransferForm = CreateTransferForm & {
  from: number;
};

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

export const TRANSFER = "TRANSFER";

export type IDefineTransfer = {
  id: number;
  amount: number;
  to: User;
  from: User;
  context: string;
  type: typeof TRANSFER;
  createdAt: Date;
};
