import { ONE_DAY_IN_MS } from "@overbookd/time";
import { beforeEach, describe, expect, it } from "vitest";
import { ForgetMember } from "./forget-member.js";
import {
  StoredMember,
  InMemoryMemberRepository,
} from "./member-repository.inmemory.js";
import {
  HAS_ACTIVITY_ERROR_MESSAGE,
  HAS_FUTURE_ASSIGNMENT_ERROR_MESSAGE,
  HAS_MONEY_ERROR_MESSAGE,
  HAS_TASK_ERROR_MESSAGE,
  IN_DEBT_ERROR_MESSAGE,
} from "./forget-member.error.js";
import {
  ANONYMOUS,
  ANONYMOUS_BIRTH_DATE,
  ANONYMOUS_MOBILE_PHONE,
} from "./anonymous-member.js";

const defaultData: Omit<StoredMember, "id" | "email"> = {
  password: "P4ssW0rd1234^",
  birthDate: new Date("1990-01-01"),
  assignments: [],
  balance: 0,
  transactions: [],
  activities: false,
  tasks: false,
  comment: "Ceci est un commentaire",
  note: "Ceci est une note",
  profilePicture: "https://example.com/profile-picture.jpg",
};

const withTaskMember: StoredMember = {
  ...defaultData,
  id: 1,
  email: "with-task@24heures.org",
  assignments: [{ end: new Date(Date.now() + ONE_DAY_IN_MS * 30) }],
  balance: 10,
  transactions: [{ from: 0, to: 1 }],
};

const inDebtMember: StoredMember = {
  ...defaultData,
  id: 2,
  email: "in-debt@24heures.org",
  balance: -5,
  transactions: [{ from: 2, to: 0 }],
};

const positiveBalanceMember: StoredMember = {
  ...defaultData,
  id: 3,
  email: "positive-account@24heures.org",
  balance: 20,
  transactions: [{ from: 0, to: 2 }],
};

const withoutTransactionsMember: StoredMember = {
  ...defaultData,
  id: 4,
  email: "withoutTransaction@24heures.org",
  assignments: [{ end: new Date("2022-05-12") }],
};

const withTransactionsMember: StoredMember = {
  ...defaultData,
  id: 5,
  email: "withTransaction@24heures.org",
  assignments: [{ end: new Date("2022-05-12") }],
  balance: 0,
  transactions: [
    { from: 0, to: 5 },
    { from: 5, to: 0 },
  ],
};

const withActivitiesMember: StoredMember = {
  ...defaultData,
  id: 6,
  email: "with-activities@24heures.org",
  activities: true,
};

const withTasksMember: StoredMember = {
  ...defaultData,
  id: 7,
  email: "with-tasks@24heures.org",
  tasks: true,
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
      withActivitiesMember,
      withTasksMember,
    ]);
    forget = new ForgetMember(memberRepository);
  });
  describe("when asking to forget a member", () => {
    describe("when he has task assigned in futur", () => {
      it("should indicate that we can't forget about assigned member", async () => {
        expect(
          async () => await forget.apply(withTaskMember.id),
        ).rejects.toThrow(HAS_FUTURE_ASSIGNMENT_ERROR_MESSAGE);
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
    describe("when he has activities", () => {
      it("should indicate that we can't forget about member with activities", async () => {
        expect(
          async () => await forget.apply(withActivitiesMember.id),
        ).rejects.toThrow(HAS_ACTIVITY_ERROR_MESSAGE);
      });
    });
    describe("when he has tasks", () => {
      it("should indicate that we can't forget about member with tasks", async () => {
        expect(
          async () => await forget.apply(withTasksMember.id),
        ).rejects.toThrow(HAS_TASK_ERROR_MESSAGE);
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
          birthDate: ANONYMOUS_BIRTH_DATE,
          nickname: null,
          comment: null,
          note: null,
          profilePicture: null,
          oidcId: null,
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
