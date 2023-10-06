export type CreateTransferForm = {
  to: number;
  amount: number;
  context: string;
};

export type TransferForm = CreateTransferForm & {
  from: number;
};
