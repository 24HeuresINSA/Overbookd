import {
  AssignedInFuturTask,
  HaveTransactions,
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
  getId(email: string): Promise<number | null>;
}

export class ForgetMember {
  constructor(private readonly members: MemberRepository) {}

  async forgetMe({ email, password }: Credentials) {
    const [member, hasTasks, hasDebts, hasTransactions] = await Promise.all([
      this.members.authenticate({ email, password }),
      this.members.hasTasks(email),
      this.members.hasDebts(email),
      this.members.hasTransactions(email),
    ]);

    if (!member) throw new WrongCrendentials();
    if (hasTasks) throw new AssignedInFuturTask();
    if (hasDebts) throw new InDebt();

    const strategy = hasTransactions ? WithTransactions : WithoutTransactions;
    const strategyInitializer = { id: member.id, repository: this.members };

    return strategy.init(strategyInitializer).forget();
  }

  async forgetHim(email: string) {
    const [hasTasks, hasDebts, hasTransactions, id] = await Promise.all([
      this.members.hasTasks(email),
      this.members.hasDebts(email),
      this.members.hasTransactions(email),
      this.members.getId(email),
    ]);

    if (!id) return;
    if (hasTasks) throw new AssignedInFuturTask(false);
    if (hasDebts) throw new InDebt(false);
    if (hasTransactions) throw new HaveTransactions();

    return WithoutTransactions.init({ id, repository: this.members }).forget();
  }
}
