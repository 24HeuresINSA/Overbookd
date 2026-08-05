import { updateItemToList } from "@overbookd/list";
import { AnonymousMember } from "./anonymous-member.js";
import { MemberRepository } from "./forget-member.js";

type Assignment = {
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
  birthDate: Date;
  assignments: Assignment[];
  tasks: boolean;
  activities: boolean;
  balance: number;
  transactions: Transaction[];
  comment?: string;
  note?: string;
  profilePicture?: string;
};

export class InMemoryMemberRepository implements MemberRepository {
  constructor(private members: StoredMember[]) {}

  hasFutureAssignments(id: number): Promise<boolean> {
    return Promise.resolve(
      this.members
        .find((member) => member.id === id)
        ?.assignments?.some(({ end }) => end.getTime() > Date.now()) ?? false,
    );
  }

  hasActivities(id: number): Promise<boolean> {
    return Promise.resolve(
      this.members.find((member) => member.id === id)?.activities ?? false,
    );
  }

  hasTasks(id: number): Promise<boolean> {
    return Promise.resolve(
      this.members.find((member) => member.id === id)?.tasks ?? false,
    );
  }

  hasDebts(id: number): Promise<boolean> {
    return Promise.resolve(
      (this.members.find((member) => member.id === id)?.balance ?? 0) < 0,
    );
  }

  hasMoney(id: number): Promise<boolean> {
    return Promise.resolve(
      (this.members.find((member) => member.id === id)?.balance ?? 0) > 0,
    );
  }

  hasTransactions(id: number): Promise<boolean> {
    return Promise.resolve(
      (this.members.find((member) => member.id === id)?.transactions?.length ??
        0) > 0,
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
}
