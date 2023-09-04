import { AssignedInFuturTask, InDebt } from "./forget-member.error";
import { AnonymousMember } from "./anonymous-member";
import {
  WithTransactions,
  WithoutTransactions,
} from "./forget-about.strategy";

export interface MemberRepository {
  hasTasks(email: string): Promise<boolean>;
  hasDebts(email: string): Promise<boolean>;
  hasTransactions(email: string): Promise<boolean>;
  delete(id: number): Promise<void>;
  getId(email: string): Promise<number>;
  anonymize(id: number, anonymous: AnonymousMember): Promise<AnonymousMember>;
}

export class ForgetMember {
  constructor(private readonly members: MemberRepository) {}

  async with(email: string) {
    const [hasTasks, hasDebts, hasTransactions, id] = await Promise.all([
      this.members.hasTasks(email),
      this.members.hasDebts(email),
      this.members.hasTransactions(email),
      this.members.getId(email),
    ]);

    if (hasTasks) {
      throw new AssignedInFuturTask();
    }
    if (hasDebts) {
      throw new InDebt();
    }

    const strategy = hasTransactions ? WithTransactions : WithoutTransactions;
    const strategyInitializer = { id, repository: this.members };

    return strategy.init(strategyInitializer).forget();
  }
}
