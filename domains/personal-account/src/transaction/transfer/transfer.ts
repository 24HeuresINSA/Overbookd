import {
  InsufficientAmount,
  NegativeAmount,
  PayeeNotHavePersonalAccount,
  PayorNotHavePersonalAccount,
  TransferToYourself,
} from "./transfer.error";
import { TransferForm } from "./payor";

export type Member = {
  havePersonalAccount: boolean;
};

type TransferParticipant = {
  id: number;
  balance: number;
};

export type TransferResponse = {
  from: TransferParticipant;
  to: TransferParticipant;
};

export interface MemberRepository {
  getById: (adherentId: number) => Promise<Member>;
}

export interface TransferRepository {
  create: (transfer: TransferForm) => Promise<TransferResponse>;
}

export class Transfer {
  constructor(
    private readonly transfers: TransferRepository,
    private readonly members: MemberRepository,
  ) {}

  async send(transfer: TransferForm): Promise<TransferResponse> {
    if (transfer.to === transfer.from) throw new TransferToYourself();

    if (transfer.amount < 0) throw new NegativeAmount();
    if (transfer.amount == 0) throw new InsufficientAmount();

    const [payor, payee] = await Promise.all([
      this.members.getById(transfer.from),
      this.members.getById(transfer.to),
    ]);

    if (!payor.havePersonalAccount) {
      throw new PayorNotHavePersonalAccount();
    }
    if (!payee.havePersonalAccount) {
      throw new PayeeNotHavePersonalAccount();
    }

    return this.transfers.create(transfer);
  }
}
