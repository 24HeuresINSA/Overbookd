import { ONE_DAY_IN_MS } from "@overbookd/time";
import { beforeEach, describe, expect, it } from "vitest";
import { ForgetMember } from "./forget-member.js";
import {
  StoredMember,
  InMemoryMemberRepository,
} from "./member-repository.inmemory.js";
import {
  ASSIGNED_IN_FUTUR_TASK_ERROR_MESSAGE,
  HAS_MONEY_ERROR_MESSAGE,
  IN_DEBT_ERROR_MESSAGE,
} from "./forget-member.error.js";
import { ANONYMOUS, ANONYMOUS_MOBILE_PHONE } from "./anonymous-member.js";

const withTaskMember: StoredMember = {
  id: 1,
  email: "with-task@24heures.org",
  password: "P4ssW0rd1234^",
  tasks: [{ end: new Date(Date.now() + ONE_DAY_IN_MS * 30) }],
  balance: 10,
  transactions: [{ from: 0, to: 1 }],
  comment: "Commentaire",
};

const inDebtMember: StoredMember = {
  id: 2,
  email: "in-debt@24heures.org",
  password: "P4ssW0rd1234^",
  tasks: [],
  balance: -5,
  transactions: [{ from: 2, to: 0 }],
};

const positiveBalanceMember: StoredMember = {
  id: 3,
  email: "positive-account@24heures.org",
  password: "P4ssW0rd1234^",
  tasks: [],
  balance: 20,
  transactions: [{ from: 0, to: 2 }],
};

const withoutTransactionsMember: StoredMember = {
  id: 4,
  email: "withoutTransaction@24heures.org",
  password: "P4ssW0rd1234^",
  tasks: [{ end: new Date("2022-05-12") }],
  balance: 0,
  transactions: [],
};

const withTransactionsMember: StoredMember = {
  id: 5,
  email: "withTransaction@24heures.org",
  password: "P4ssW0rd1234^",
  tasks: [{ end: new Date("2022-05-12") }],
  balance: 0,
  transactions: [
    { from: 0, to: 5 },
    { from: 5, to: 0 },
  ],
  comment: "Ceci est un commentaire",
  note: "SUper bénévole",
};

describe("Forget member", () => {
  let forget: ForgetMember;
  let memberRepository: InMemoryMemberRepository;
  beforeEach(() => {
    memberRepository = new InMemoryMemberRepository([
      withTaskMember,
      positiveBalanceMember,
      inDebtMember,
      withoutTransactionsMember,
      withTransactionsMember,
    ]);
    forget = new ForgetMember(memberRepository);
  });
  describe("when asking to forget a member", () => {
    describe("when he has task assigned in futur", () => {
      it("should indicate that we can't forget about assigned member", async () => {
        expect(
          async () => await forget.apply(withTaskMember.id),
        ).rejects.toThrow(ASSIGNED_IN_FUTUR_TASK_ERROR_MESSAGE);
      });
    });
    describe("when he has money in his account", () => {
      it("should indicate that we can't forget about member with money in his account", async () => {
        expect(
          async () => await forget.apply(positiveBalanceMember.id),
        ).rejects.toThrow(HAS_MONEY_ERROR_MESSAGE);
      });
    });
    describe("when he is in debt", () => {
      it("should indicate that we can't forget about in debt member", async () => {
        expect(async () => await forget.apply(inDebtMember.id)).rejects.toThrow(
          IN_DEBT_ERROR_MESSAGE,
        );
      });
    });
    describe("when he has transactions", () => {
      it("should anonymize member personal data", async () => {
        const anonymizedMember = await forget.apply(withTransactionsMember.id);
        expect(anonymizedMember).toEqual({
          email: "anonymous+5@24heures.org",
          firstName: ANONYMOUS,
          lastName: ANONYMOUS,
          mobilePhone: ANONYMOUS_MOBILE_PHONE,
          nickname: null,
          comment: null,
          note: null,
        });
      });
    });
    describe("when he doesn't have transactions", () => {
      it("should remove member data from storage", async () => {
        await forget.apply(withoutTransactionsMember.id);
        expect(memberRepository.storedMembers).not.toContainEqual(
          withoutTransactionsMember,
        );
      });
    });
  });
});
