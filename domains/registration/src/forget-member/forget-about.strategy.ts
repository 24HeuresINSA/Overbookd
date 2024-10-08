import {
  AnonymousMember,
  ANONYMOUS,
  ANONYMOUS_MOBILE_PHONE,
} from "./anonymous-member.js";
import { MemberRepository } from "./forget-member.js";

type ForgetAboutMember = {
  forget(): Promise<void | AnonymousMember>;
};

type InitForgetAboutStrategy = {
  id: number;
  repository: MemberRepository;
};

export class WithoutTransactions implements ForgetAboutMember {
  private constructor(
    private readonly id: number,
    private readonly members: MemberRepository,
  ) {}

  static init({ id, repository }: InitForgetAboutStrategy) {
    return new WithoutTransactions(id, repository);
  }

  async forget(): Promise<void> {
    await this.members.delete(this.id);
  }
}

export class WithTransactions implements ForgetAboutMember {
  private constructor(
    private readonly id: number,
    private readonly members: MemberRepository,
  ) {}

  static init({ id, repository }: InitForgetAboutStrategy) {
    return new WithTransactions(id, repository);
  }

  forget(): Promise<AnonymousMember> {
    const anonymizedMember: AnonymousMember = {
      firstname: ANONYMOUS,
      lastname: ANONYMOUS,
      mobilePhone: ANONYMOUS_MOBILE_PHONE,
      email: `anonymous+${this.id}@24heures.org`,
      comment: null,
      nickname: null,
    };
    return this.members.anonymize(this.id, anonymizedMember);
  }
}
