import { User } from "@overbookd/user";
import { HAVE_PERSONNAL_ACCOUNT, Permission } from "@overbookd/permission";
import { MyTransaction, Transaction } from "./transaction.model";
import { TransferForm, TransferRepository } from "./transfer";

type WithBalance = {
  permissions: Permission[];
};

type WithPermission = {
  permissions: Permission[];
};

export type Member = User & WithBalance;

export type MemberWithPermission = Member & WithPermission;


export class InMemoryTransferRepository implements TransferRepository {
  constructor(
    private transfers: Transaction[],
    private readonly members: MemberWithPermission[],
  ) {}

  private get adherents(): Member[] {
    return this.members
      .filter((member) => member.permissions.includes(HAVE_PERSONNAL_ACCOUNT))
      .map(({ permissions, ...adherent }) => adherent);
  }

  create(transfer: TransferForm): Promise<MyTransaction> {
    const payor = this.adherents.find((adherent) => adherent.id === transfer.from);
    const payee = this.adherents.find((adherent) => adherent.id === transfer.to);

    payor.balance -= transfer.amount;
    payee.balance += transfer.amount;

    return Promise.resolve({
      id: this.transfers.length + 1,
      amount: transfer.amount,
      to: { ...payee, balance: undefined },
      context: transfer.context,
      createdAt: new Date(),
    });
  }

  isAllowedToTransfer(memberId: number): Promise<boolean> {
    const isAdherent = this.adherents.some(
      (adherent) => adherent.id === memberId,
    );
    return Promise.resolve(isAdherent);
  }
}
