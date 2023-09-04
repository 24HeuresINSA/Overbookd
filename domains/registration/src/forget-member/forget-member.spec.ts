import { ONE_DAY_IN_MS } from "@overbookd/period";
import { beforeEach, describe, expect, it } from "vitest";
import { ForgetMember } from "./forget-member";
import {
  StoredMember,
  InMemoryMemberRepository,
} from "./member-repository.inmemory";
import { ANONYMOUS, ANONYMOUS_MOBILE_PHONE } from "./anonymous-member";
import {
  ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE,
  IN_DEBT_ERROR_MESSAGE,
} from "./forget-member.error";

const withTaskMember: StoredMember = {
  id: 1,
  email: "with-task@24heures.org",
  tasks: [{ end: new Date(Date.now() + ONE_DAY_IN_MS * 30) }],
  balance: 10,
  transactions: [{ from: 0, to: 1 }],
};

const inDebtMember: StoredMember = {
  id: 2,
  email: "in-debt@24heures.org",
  tasks: [],
  balance: -5,
  transactions: [{ from: 2, to: 0 }],
};

const withoutTransactionsMember: StoredMember = {
  id: 3,
  email: "withoutTransaction@24heures.org",
  tasks: [{ end: new Date("2022-05-12") }],
  balance: 0,
  transactions: [],
};

const withTransactionsMember: StoredMember = {
  id: 4,
  email: "withTransaction@24heures.org",
  tasks: [{ end: new Date("2022-05-12") }],
  balance: 0,
  transactions: [
    { from: 0, to: 4 },
    { from: 4, to: 0 },
  ],
};

describe("Forget member", () => {
  let forgetMember: ForgetMember;
  let memberRepository: InMemoryMemberRepository;
  beforeEach(() => {
    memberRepository = new InMemoryMemberRepository([
      withTaskMember,
      inDebtMember,
      withoutTransactionsMember,
      withTransactionsMember,
    ]);
    forgetMember = new ForgetMember(memberRepository);
  });
  describe("when asking to forget a member with task assigned in futur", () => {
    it("should indicate that we can't forget about assigned member", async () => {
      expect(
        async () => await forgetMember.with(withTaskMember.email),
      ).rejects.toThrow(ASSINGED_IN_FUTUR_TASK_ERROR_MESSAGE);
    });
  });
  describe("when asking to forget a member with debt", () => {
    it("should indicate that we can't forget about in debt member", async () => {
      expect(
        async () => await forgetMember.with(inDebtMember.email),
      ).rejects.toThrow(IN_DEBT_ERROR_MESSAGE);
    });
  });
  describe("when asking to forget a member without transactions", () => {
    it("should remove member data from storage", async () => {
      await forgetMember.with(withoutTransactionsMember.email);
      expect(memberRepository.storedMembers).not.toContainEqual(
        withoutTransactionsMember,
      );
    });
  });
  describe("when asking to forget a member without transactions", () => {
    it("should anonymize member personnal data", async () => {
      const anonymizedMember = await forgetMember.with(
        withTransactionsMember.email,
      );
      expect(anonymizedMember).toEqual({
        email: "anonymous+4@24heures.org",
        firstname: ANONYMOUS,
        lastname: ANONYMOUS,
        mobilePhone: ANONYMOUS_MOBILE_PHONE,
        nickname: null,
        comments: null,
      });
    });
  });
});
