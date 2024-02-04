import { HAVE_PERSONAL_ACCOUNT, Permission } from "@overbookd/permission";
import { Member, MemberRepository } from "./transfer";

type StoredMember = {
  id: number;
  balance: number;
  permissions: Permission[];
};

export class InMemoryMemberRepository implements MemberRepository {
  constructor(private readonly members: StoredMember[]) {}

  getById(adherentId: number): Promise<Member> {
    const member = this.members.find((m) => m.id === adherentId);
    if (!member) {
      const wrongAdherent: Member = { havePersonalAccount: false };
      return Promise.resolve(wrongAdherent);
    }
    const havePersonalAccount = member.permissions.includes(
      HAVE_PERSONAL_ACCOUNT,
    );
    return Promise.resolve({ havePersonalAccount, balance: member.balance });
  }
}
