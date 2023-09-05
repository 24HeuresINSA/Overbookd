import {
  AssignedInFuturTask,
  InDebt,
  WrongCrendentials,
} from "./forget-member.error";
import { AnonymousMember } from "./anonymous-member";
import { WithTransactions, WithoutTransactions } from "./forget-about.strategy";

export type Credentials = {
  email: string;
  password: string;
};

export type Member = {
  id: number;
};

export interface MemberRepository {
  hasTasks(email: string): Promise<boolean>;
  hasDebts(email: string): Promise<boolean>;
  hasTransactions(email: string): Promise<boolean>;
  delete(id: number): Promise<void>;
  anonymize(id: number, anonymous: AnonymousMember): Promise<AnonymousMember>;
  authenticate(credentials: Credentials): Promise<Member | null>;
}

export class ForgetMember {
  constructor(private readonly members: MemberRepository) {}

  async with({ email, password }: Credentials) {
    const [member, hasTasks, hasDebts, hasTransactions] = await Promise.all([
      this.members.authenticate({ email, password }),
      this.members.hasTasks(email),
      this.members.hasDebts(email),
      this.members.hasTransactions(email),
    ]);

    if (!member) {
      throw new WrongCrendentials();
    }

    if (hasTasks) {
      throw new AssignedInFuturTask();
    }
    if (hasDebts) {
      throw new InDebt();
    }

    const strategy = hasTransactions ? WithTransactions : WithoutTransactions;
    const strategyInitializer = { id: member.id, repository: this.members };

    return strategy.init(strategyInitializer).forget();
  }
}
