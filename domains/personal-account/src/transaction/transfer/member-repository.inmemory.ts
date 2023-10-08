import { HAVE_PERSONAL_ACCOUNT, Permission } from "@overbookd/permission";
import { Member, MemberRepository } from "./transfer";

export type StoredMember = {
  id: number;
  permissions: Permission[];
}

export class InMemoryMemberRepository implements MemberRepository {

  constructor(private members: StoredMember[]) {}

  getById(adherentId: number): Promise<Member> {
    const member = this.members.find((m) => m.id === adherentId);
    if (!member) {
      const wrongAdherent = { havePersonalAccount: false };
      return Promise.resolve(wrongAdherent);
    }
    const havePersonalAccount = member.permissions.includes(HAVE_PERSONAL_ACCOUNT);
    return Promise.resolve({ havePersonalAccount });
  }

}
