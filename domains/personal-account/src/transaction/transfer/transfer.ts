import {
  InsufficientAmount,
  NegativeAmount,
  PayeeNotHavePersonalAccount,
  PayorNotHavePersonalAccount,
  TransferToYourself,
} from "./transfer.error";
import { IDefineTransfer, TransferForm } from "./transfer.model";

export interface TransferRepository {
  create: (transfer: TransferForm) => Promise<IDefineTransfer>;
  isAllowedToTransfer: (memberId: number) => Promise<boolean>;
}

export class Transfer {
  constructor(private readonly transfers: TransferRepository) {}

  async send(transfer: TransferForm): Promise<IDefineTransfer> {
    if (transfer.to === transfer.from) throw new TransferToYourself();

    if (transfer.amount < 0) throw new NegativeAmount();
    if (transfer.amount == 0) throw new InsufficientAmount();

    const [isPayorAllowed, isPayeeAllowed] = await Promise.all([
      this.transfers.isAllowedToTransfer(transfer.from),
      this.transfers.isAllowedToTransfer(transfer.to),
    ]);

    if (!isPayorAllowed) throw new PayorNotHavePersonalAccount();
    if (!isPayeeAllowed) throw new PayeeNotHavePersonalAccount();

    return this.transfers.create(transfer);
  }
}
