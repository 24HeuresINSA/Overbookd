import {
  AmountTooHigh,
  InsufficientAmount,
  NegativeAmount,
  NegativePersonalAccount,
  PayeeNotHavePersonalAccount,
  PayorNotHavePersonalAccount,
  TransferToYourself,
} from "./transfer.error";
import { TransferForm } from "./payor";
import { ONE_EURO_IN_CENTS } from "../transaction.model";

type NonAdherent = {
  havePersonalAccount: false;
};

type Adherent = {
  havePersonalAccount: true;
  balance: number;
};

export type Member = NonAdherent | Adherent;

type TransferParticipant = {
  id: number;
  balance: number;
};

export type TransferResponse = {
  from: TransferParticipant;
  to: TransferParticipant;
};

export type MemberRepository = {
  getById: (adherentId: number) => Promise<Member>;
};

export type TransferRepository = {
  create: (transfer: TransferForm) => Promise<TransferResponse>;
};

const MAX_TRANSFER_AMOUNT = ONE_EURO_IN_CENTS * 500;

export class Transfer {
  constructor(
    private readonly transfers: TransferRepository,
    private readonly members: MemberRepository,
  ) {}

  async send(transfer: TransferForm): Promise<TransferResponse> {
    if (transfer.to === transfer.from) throw new TransferToYourself();

    if (transfer.amount < 0) throw new NegativeAmount();
    if (transfer.amount == 0) throw new InsufficientAmount();
    if (transfer.amount > MAX_TRANSFER_AMOUNT) throw new AmountTooHigh();

    const [payor, payee] = await Promise.all([
      this.members.getById(transfer.from),
      this.members.getById(transfer.to),
    ]);

    if (!payor.havePersonalAccount) throw new PayorNotHavePersonalAccount();
    if (payor.balance < 0) throw new NegativePersonalAccount();
    if (!payee.havePersonalAccount) throw new PayeeNotHavePersonalAccount();

    return this.transfers.create(transfer);
  }
}
