import {
  HasActivity,
  HasFutureAssignment,
  HasMoney,
  HasTask,
  InDebt,
} from "./forget-member.error.js";
import { AnonymousMember } from "./anonymous-member.js";
import {
  WithoutTransactions,
  WithTransactions,
} from "./forget-about.strategy.js";

export type MemberRepository = {
  hasFutureAssignments(id: number): Promise<boolean>;
  hasActivities(id: number): Promise<boolean>;
  hasTasks(id: number): Promise<boolean>;
  hasDebts(id: number): Promise<boolean>;
  hasMoney(id: number): Promise<boolean>;
  hasTransactions(id: number): Promise<boolean>;
  delete(id: number): Promise<void>;
  anonymize(id: number, anonymous: AnonymousMember): Promise<AnonymousMember>;
};

export class ForgetMember {
  constructor(private readonly members: MemberRepository) {}

  async apply(id: number) {
    const [
      hasFutureAssignments,
      hasActivities,
      hasTasks,
      hasDebts,
      hasMoney,
      hasTransactions,
    ] = await Promise.all([
      this.members.hasFutureAssignments(id),
      this.members.hasActivities(id),
      this.members.hasTasks(id),
      this.members.hasDebts(id),
      this.members.hasMoney(id),
      this.members.hasTransactions(id),
    ]);

    if (hasFutureAssignments) throw new HasFutureAssignment();
    if (hasActivities) throw new HasActivity();
    if (hasTasks) throw new HasTask();
    if (hasDebts) throw new InDebt();
    if (hasMoney) throw new HasMoney();

    const strategy = hasTransactions ? WithTransactions : WithoutTransactions;
    const strategyInitializer = { id, repository: this.members };

    return strategy.init(strategyInitializer).forget();
  }
}
