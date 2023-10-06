import { HAVE_PERSONAL_ACCOUNT, Permission } from "@overbookd/permission";
import { updateItemToList } from "@overbookd/list";
import { Transaction, User, transactionTypes } from "../transaction.model";
import { TransferRepository } from ".";
import { TransferForm } from "./transfer.model";

type WithBalance = {
  balance: number;
};

type Member = User & WithBalance;

type WithPermissions = {
  permissions: Permission[];
};

export type MemberWithPermissions = Member & WithPermissions;

export class InMemoryTransferRepository implements TransferRepository {
  constructor(
    private transfers: Transaction[],
    private members: MemberWithPermissions[],
  ) {}

  get adherents(): Member[] {
    return this.members
      .filter((member) => member.permissions.includes(HAVE_PERSONAL_ACCOUNT))
      .map(({ permissions, ...adherent }) => adherent);
  }

  create(transfer: TransferForm): Promise<Transaction> {
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

    const { balance: balance1, ...payorAsUser } = payor;
    const { balance: balance2, ...payeeAsUser } = payee;

    return Promise.resolve({
      id: this.transfers.length + 1,
      amount: transfer.amount,
      from: payorAsUser,
      to: payeeAsUser,
      type: transactionTypes.TRANSFER,
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
    const adherent: MemberWithPermissions = {
      ...member,
      permissions: [HAVE_PERSONAL_ACCOUNT],
    };
    this.members = updateItemToList(this.members, index, adherent);
  }
}
