import { describe, expect, it } from "vitest";
import { InMemoryCandidates } from "./candidates.inmemory.js";
import {
  lea,
  leaStaffCandidate,
  leaVolunteerCandidate,
  olop,
  rejectedOlopStaffCandidate,
  rejectedOlopVolunteerCandidate,
} from "./candidate.test-utils.js";
import { AlreadyCandidateForMembership } from "./candidature.error.js";
import { STAFF, VOLUNTEER } from "../newcomer.js";
import { SwitchMembershipApplication } from "./switch.js";
import type { Candidate } from "./candidates.js";

describe("Switch a membership application", () => {
  describe("when a candidate has applied for volunteer membership for the current edition", () => {
    it("should switch the application membership", async () => {
      const candidates = new InMemoryCandidates([leaVolunteerCandidate]);
      const switchApplication = new SwitchMembershipApplication(candidates);
      await switchApplication.applyOne(lea.id, VOLUNTEER, STAFF);
      const expected: Candidate = {
        ...leaStaffCandidate,
        membership: STAFF,
      };
      expect(candidates.staffs).toContainEqual(expected);
      expect(candidates.volunteers).toHaveLength(0);
    });
  });

  describe("when a candidate has applied for staff membership for the current edition", () => {
    it("should switch the application membership", async () => {
      const candidates = new InMemoryCandidates([leaStaffCandidate]);
      const switchApplication = new SwitchMembershipApplication(candidates);
      await switchApplication.applyOne(lea.id, STAFF, VOLUNTEER);
      const expected: Candidate = {
        ...leaStaffCandidate,
        membership: VOLUNTEER,
      };
      expect(candidates.volunteers).toContainEqual(expected);
      expect(candidates.staffs).toHaveLength(0);
    });
  });

  describe.each`
    baseCandidates                                | id         | membership   | newMembership
    ${[leaStaffCandidate]}                        | ${lea.id}  | ${VOLUNTEER} | ${STAFF}
    ${[leaStaffCandidate]}                        | ${lea.id}  | ${STAFF}     | ${STAFF}
    ${[leaVolunteerCandidate, leaStaffCandidate]} | ${lea.id}  | ${STAFF}     | ${VOLUNTEER}
    ${[rejectedOlopVolunteerCandidate]}           | ${olop.id} | ${STAFF}     | ${VOLUNTEER}
  `(
    "when a candidate has already applied for $newMembership membership for the current edition",
    ({ baseCandidates, id, membership, newMembership }) => {
      it("should indicate that the candidate has already applied for this membership", async () => {
        const candidates = new InMemoryCandidates(baseCandidates);
        const switchApplication = new SwitchMembershipApplication(candidates);
        await expect(async () =>
          switchApplication.applyOne(id, membership, newMembership),
        ).rejects.toThrow(new AlreadyCandidateForMembership(newMembership));
      });
    },
  );

  describe("when a candidate has not applied for membership for the current edition", () => {
    it("should not do anything", async () => {
      const candidates = new InMemoryCandidates([]);
      const switchApplication = new SwitchMembershipApplication(candidates);
      await switchApplication.applyOne(lea.id, VOLUNTEER, STAFF);
      expect(candidates.staffs).toHaveLength(0);
      expect(candidates.volunteers).toHaveLength(0);
    });
  });

  describe("when a candidate has been rejected for volunteer membership for the current edition", () => {
    it("should switch the application membership and cancel the rejection", async () => {
      const candidates = new InMemoryCandidates([
        rejectedOlopVolunteerCandidate,
      ]);
      const switchApplication = new SwitchMembershipApplication(candidates);
      await switchApplication.applyOne(olop.id, VOLUNTEER, STAFF);
      const expected: Candidate = {
        ...rejectedOlopVolunteerCandidate,
        membership: STAFF,
        isRejected: false,
      };
      expect(candidates.staffs).toContainEqual(expected);
      expect(candidates.volunteers).toHaveLength(0);
    });
  });

  describe("when a candidate has been rejected for staff membership for the current edition", () => {
    it("should switch the application membership and cancel the rejection", async () => {
      const candidates = new InMemoryCandidates([rejectedOlopStaffCandidate]);
      const switchApplication = new SwitchMembershipApplication(candidates);
      await switchApplication.applyOne(olop.id, STAFF, VOLUNTEER);
      const expected: Candidate = {
        ...rejectedOlopStaffCandidate,
        membership: VOLUNTEER,
        isRejected: false,
      };
      expect(candidates.volunteers).toContainEqual(expected);
      expect(candidates.staffs).toHaveLength(0);
    });
  });
});
