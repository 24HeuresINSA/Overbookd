import {
  AssignedInFuturTask,
  HasMoney,
  InDebt,
} from "./forget-member.error.js";
import { AnonymousMember } from "./anonymous-member.js";
import {
  WithoutTransactions,
  WithTransactions,
} from "./forget-about.strategy.js";

export type MemberRepository = {
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
    const [hasTasks, hasDebts, hasMoney, hasTransactions] = await Promise.all([
      this.members.hasTasks(id),
      this.members.hasDebts(id),
      this.members.hasMoney(id),
      this.members.hasTransactions(id),
    ]);

    if (hasTasks) throw new AssignedInFuturTask();
    if (hasDebts) throw new InDebt();
    if (hasMoney) throw new HasMoney();

    const strategy = hasTransactions ? WithTransactions : WithoutTransactions;
    const strategyInitializer = { id, repository: this.members };

    return strategy.init(strategyInitializer).forget();
  }
}
