import { HAVE_PERSONNAL_ACCOUNT, Permission } from "@overbookd/permission";
import { updateItemToList } from "@overbookd/list";
import { MyTransaction, Transaction, User } from "./transaction.model";
import { TransferForm, TransferRepository } from "./transfer";

type WithBalance = {
  balance: number;
};

type Member = User & WithBalance;

type WithPermission = {
  permissions: Permission[];
};

export type MemberWithPermission = Member & WithPermission;

export class InMemoryTransferRepository implements TransferRepository {
  constructor(
    private transfers: Transaction[],
    private members: MemberWithPermission[],
  ) {}

  get adherents(): Member[] {
    return this.members
      .filter((member) => member.permissions.includes(HAVE_PERSONNAL_ACCOUNT))
      .map(({ permissions, ...adherent }) => adherent);
  }

  create(transfer: TransferForm): Promise<MyTransaction> {
    const payor = this.adherents.find(
      (adherent) => adherent.id === transfer.from,
    );
    const payee = this.adherents.find(
      (adherent) => adherent.id === transfer.to,
    );

    if (!payor || !payee) throw new Error("Utilisateur introuvable");

    payor.balance -= transfer.amount;
    payee.balance += transfer.amount;

    this.updateMemberToList(payor);
    this.updateMemberToList(payee);

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

  private updateMemberToList(member: Member) {
    const index = this.members.findIndex((m) => m.id === member.id);
    const adherent: MemberWithPermission = {
      ...member,
      permissions: [HAVE_PERSONNAL_ACCOUNT],
    };
    this.members = updateItemToList(this.members, index, adherent);
  }
}
