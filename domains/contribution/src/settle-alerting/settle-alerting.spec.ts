import { describe, expect, it } from "vitest";
import { Edition } from "@overbookd/time";
import { PAY_CONTRIBUTION } from "@overbookd/permission";
import { InMemoryContributions } from "./contributions.inmemory.js";
import { InMemoryPermissions, Member } from "./permissions.inmemory.js";
import { SettleAlerting } from "./settle-alerting.js";
import { HAVE_TO_SETTLE_CONTRIBUTION } from "./settle-alerting.constant.js";

const CURRENT_EDITION = Edition.current;

type TestingMember = Member & {
  contributions: number[];
};

const nonAdherent: TestingMember = {
  id: 1,
  permissions: [],
  contributions: [],
};

const upToDateAdherent: TestingMember = {
  id: 2,
  permissions: [PAY_CONTRIBUTION],
  contributions: [CURRENT_EDITION],
};

const newAdherent: TestingMember = {
  id: 3,
  permissions: [PAY_CONTRIBUTION],
  contributions: [],
};

const elderAdherent: TestingMember = {
  id: 4,
  permissions: [PAY_CONTRIBUTION],
  contributions: [
    CURRENT_EDITION - 4,
    CURRENT_EDITION - 3,
    CURRENT_EDITION - 2,
    CURRENT_EDITION - 1,
  ],
};

const testingMembers: TestingMember[] = [
  nonAdherent,
  upToDateAdherent,
  newAdherent,
  elderAdherent,
];
const testingContributions = testingMembers.flatMap(({ id, contributions }) =>
  contributions.map((edition) => ({ edition, adherentId: id })),
);

describe("Settle alerting", () => {
  const permissions = new InMemoryPermissions(testingMembers);
  const contributions = new InMemoryContributions(testingContributions);
  const settleAlert = new SettleAlerting(permissions, contributions);
  describe("When volunteer is not adherent", () => {
    it("shouldn't generate alert", async () => {
      const alert = await settleAlert.for(nonAdherent.id);
      expect(alert).toBe(undefined);
    });
  });
  describe("When adherent already settled his contribution for this edition", () => {
    it("shouldn't generate alert", async () => {
      const alert = await settleAlert.for(upToDateAdherent.id);
      expect(alert).toBe(undefined);
    });
  });
  describe("When adherent didn't settle his contribution for this edition", () => {
    it("should generate an alert", async () => {
      const alert = await settleAlert.for(newAdherent.id);
      expect(alert).not.toBe(undefined);
    });
    it("should indicate adhrent have to settle his contribution", async () => {
      const alert = await settleAlert.for(newAdherent.id);
      expect(alert?.summary).toBe(HAVE_TO_SETTLE_CONTRIBUTION);
    });
    it("should indicate for which edition adherent has to contribute", async () => {
      const alert = await settleAlert.for(newAdherent.id);
      expect(alert?.edition).toBe(CURRENT_EDITION);
    });
  });
  describe("When adherent settled his contribution for a previous edition", () => {
    it("should generate an alert", async () => {
      const alert = await settleAlert.for(elderAdherent.id);
      expect(alert).not.toBe(undefined);
    });
    it("should indicate adhrent have to settle his contribution", async () => {
      const alert = await settleAlert.for(elderAdherent.id);
      expect(alert?.summary).toBe(HAVE_TO_SETTLE_CONTRIBUTION);
    });
    it("should indicate for which edition adherent has to contribute", async () => {
      const alert = await settleAlert.for(elderAdherent.id);
      expect(alert?.edition).toBe(CURRENT_EDITION);
    });
  });
});
