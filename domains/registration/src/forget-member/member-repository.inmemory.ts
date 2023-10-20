import { updateItemToList } from "@overbookd/list";
import { AnonymousMember } from "./anonymous-member";
import { Credentials, Member, MemberRepository } from "./forget-member";

type Task = {
  end: Date;
};

type Transaction = {
  from: number;
  to: number;
};

export type StoredMember = {
  id: number;
  email: string;
  password: string;
  tasks: Task[];
  balance: number;
  transactions: Transaction[];
};

export class InMemoryMemberRepository implements MemberRepository {
  constructor(private members: StoredMember[]) {}

  hasTasks(email: string): Promise<boolean> {
    return Promise.resolve(
      this.members
        .find((member) => member.email === email)
        ?.tasks?.some(({ end }) => end.getTime() > Date.now()) ?? false,
    );
  }

  hasDebts(email: string): Promise<boolean> {
    return Promise.resolve(
      (this.members.find((member) => member.email === email)?.balance ?? 0) < 0,
    );
  }

  hasTransactions(email: string): Promise<boolean> {
    return Promise.resolve(
      (this.members.find((member) => member.email === email)?.transactions
        ?.length ?? 0) > 0,
    );
  }

  async delete(id: number): Promise<void> {
    this.members = this.members.filter((member) => member.id !== id);
  }

  async anonymize(
    id: number,
    anonymous: AnonymousMember,
  ): Promise<AnonymousMember> {
    const memberIndex = this.members.findIndex((member) => member.id === id);
    const member = this.members.at(memberIndex);
    if (memberIndex === -1 || !member) {
      return Promise.reject(new Error(`Not found member with id: ${id}`));
    }

    const anonymized = { ...member, email: anonymous.email };
    this.members = updateItemToList(this.members, memberIndex, anonymized);
    return anonymous;
  }

  get storedMembers(): StoredMember[] {
    return this.members;
  }

  authenticate(credentials: Credentials): Promise<Member | null> {
    const member = this.members.find(
      ({ email, password }) =>
        email === credentials.email && password === credentials.password,
    );

    return Promise.resolve(member ? { id: member.id } : null);
  }

  getId(email: string): Promise<number | null> {
    const member = this.members.find((member) => member.email === email);
    if (!member) return Promise.resolve(null);

    return Promise.resolve(member.id);
  }
}
