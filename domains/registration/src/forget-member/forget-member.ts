import {
  HasActivity,
  HasFutureAssignment,
  HasMoney,
  HasTask,
  InDebt,
  HasOpenSharedMeal,
} from "./forget-member.error.js";
import { AnonymousMember } from "./anonymous-member.js";
import {
  WithoutTransactions,
  WithTransactions,
} from "./forget-about.strategy.js";

export type MemberRepository = {
  hasFutureAssignments(id: number): Promise<boolean>;
  activityIds(id: number): Promise<number[]>;
  taskIds(id: number): Promise<number[]>;
  hasDebts(id: number): Promise<boolean>;
  hasMoney(id: number): Promise<boolean>;
  openSharedMealDates(id: number): Promise<string[]>;
  hasTransactions(id: number): Promise<boolean>;
  delete(id: number): Promise<void>;
  anonymize(id: number, anonymous: AnonymousMember): Promise<AnonymousMember>;
};

export class ForgetMember {
  constructor(private readonly members: MemberRepository) {}

  async apply(id: number) {
    const [
      hasFutureAssignments,
      activityIds,
      taskIds,
      hasDebts,
      hasMoney,
      openSharedMealDates,
    ] = await Promise.all([
      this.members.hasFutureAssignments(id),
      this.members.activityIds(id),
      this.members.taskIds(id),
      this.members.hasDebts(id),
      this.members.hasMoney(id),
      this.members.openSharedMealDates(id),
    ]);

    if (hasFutureAssignments) throw new HasFutureAssignment();
    if (activityIds.length > 0) throw new HasActivity(activityIds);
    if (taskIds.length > 0) throw new HasTask(taskIds);
    if (openSharedMealDates.length > 0)
      throw new HasOpenSharedMeal(openSharedMealDates);
    if (hasDebts) throw new InDebt();
    if (hasMoney) throw new HasMoney();

    const hasTransactions = await this.members.hasTransactions(id);
    const strategy = hasTransactions ? WithTransactions : WithoutTransactions;
    const strategyInitializer = { id, repository: this.members };

    return strategy.init(strategyInitializer).forget();
  }

  async shouldAnonymize(id: number) {
    const hasTransactions = await this.members.hasTransactions(id);
    return hasTransactions;
  }
}
