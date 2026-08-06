import { updateItemToList } from "@overbookd/list";
import { AnonymousMember } from "./anonymous-member.js";
import { MemberRepository } from "./forget-member.js";

type Assignment = { end: Date };
type Activity = { id: number };
type Task = { id: number };

type SharedMeal = {
  date: string;
  closed: boolean;
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
  tasks: Task[];
  activities: Activity[];
  balance: number;
  transactions: Transaction[];
  comment?: string;
  note?: string;
  profilePicture?: string;
  sharedMeals: SharedMeal[];
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

  activityIds(id: number): Promise<number[]> {
    return Promise.resolve(
      this.members
        .find((member) => member.id === id)
        ?.activities?.map((a) => a.id) ?? [],
    );
  }

  taskIds(id: number): Promise<number[]> {
    return Promise.resolve(
      this.members
        .find((member) => member.id === id)
        ?.tasks?.map((t) => t.id) ?? [],
    );
  }

  openSharedMealDates(id: number): Promise<string[]> {
    return Promise.resolve(
      this.members
        .find((member) => member.id === id)
        ?.sharedMeals?.filter((sm) => !sm.closed)
        .map((sm) => sm.date) ?? [],
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
