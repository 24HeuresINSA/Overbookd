import { MyTransfer } from "./transaction.model";
import {
  InsufficientAmount,
  NegativeAmount,
  PayeeNotHavePersonalAccount,
  PayorNotHavePersonalAccount,
  TransferToYourself,
} from "./transfer.error";

type CreateTransferForm = {
  to: number;
  amount: number;
  context: string;
};

export type TransferForm = CreateTransferForm & {
  from: number;
};

export interface TransferRepository {
  create: (transfer: TransferForm) => Promise<MyTransfer>;
  isAllowedToTransfer: (memberId: number) => Promise<boolean>;
}

export class Transfer {
  constructor(private readonly transfers: TransferRepository) {}

  async for(
    transfer: CreateTransferForm,
    from: number,
  ): Promise<MyTransfer> {
    if (transfer.to === from) throw new TransferToYourself();

    if (transfer.amount < 0) throw new NegativeAmount();
    if (transfer.amount == 0) throw new InsufficientAmount();

    const [isPayorAllowed, isPayeeAllowed] = await Promise.all([
      this.transfers.isAllowedToTransfer(from),
      this.transfers.isAllowedToTransfer(transfer.to)
    ]);

    if (!isPayorAllowed) throw new PayorNotHavePersonalAccount();
    if (!isPayeeAllowed) throw new PayeeNotHavePersonalAccount();

    return this.transfers.create({
      ...transfer,
      from,
    });
  }
}
