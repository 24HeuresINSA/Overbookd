import { describe, expect, it } from "vitest";
import { InMemoryCandidates } from "./candidates.inmemory.js";
import {
  dnamra,
  lea,
  leaStaffCandidate,
  leaVolunteerCandidate,
  oel,
  oelCandidate,
  olop,
  rejectedDnamraCandidate,
  rejectedOlopStaffCandidate,
  rejectedOlopVolunteerCandidate,
} from "./candidate.test-utils.js";
import { RejectMembershipApplication } from "./reject.js";
import { AlreadyRejected, NotRejected } from "./candidature.error.js";
import { STAFF, VOLUNTEER } from "../newcomer.js";

describe("Reject one membership application", () => {
  describe("when a candidate has applied for staff membership for the current edition", () => {
    it("should reject the application", async () => {
      const candidates = new InMemoryCandidates([leaStaffCandidate]);
      const reject = new RejectMembershipApplication(candidates);
      await reject.applyOne(lea, STAFF);
      const expected = { ...leaStaffCandidate, isRejected: true };
      expect(candidates.staffs).toContainEqual(expected);
    });
  });

  describe("when a candidate has applied for volunteer membership for the current edition", () => {
    it("should reject the application", async () => {
      const candidates = new InMemoryCandidates([oelCandidate]);
      const reject = new RejectMembershipApplication(candidates);
      await reject.applyOne(oel, VOLUNTEER);
      const expected = { ...oelCandidate, isRejected: true };
      expect(candidates.volunteers).toContainEqual(expected);
    });
  });

  describe("when a candidate has already been rejected for staff membership for the current edition", () => {
    it("should indicate that the candidate has already been rejected for staff membership for this edition", () => {
      const candidates = new InMemoryCandidates([rejectedOlopStaffCandidate]);
      const reject = new RejectMembershipApplication(candidates);
      expect(async () => reject.applyOne(olop, STAFF)).rejects.toThrowError(
        new AlreadyRejected(STAFF),
      );
    });
  });

  describe("when a candidate has already been rejected for volunteer membership for the current edition", () => {
    it("should indicate that the candidate has already been rejected for volunteer membership for this edition", () => {
      const candidates = new InMemoryCandidates([rejectedDnamraCandidate]);
      const reject = new RejectMembershipApplication(candidates);
      expect(async () =>
        reject.applyOne(dnamra, VOLUNTEER),
      ).rejects.toThrowError(new AlreadyRejected(VOLUNTEER));
    });
  });

  describe("when a candidate has applied for staff and volunteer membership for the current edition", () => {
    it("should reject the application for staff membership", async () => {
      const candidates = new InMemoryCandidates([
        leaStaffCandidate,
        leaVolunteerCandidate,
      ]);
      const reject = new RejectMembershipApplication(candidates);
      await reject.applyOne(lea, STAFF);
      const expected = { ...leaStaffCandidate, isRejected: true };
      expect(candidates.staffs).toContainEqual(expected);
      expect(candidates.volunteers).toContainEqual(leaVolunteerCandidate);
    });

    it("should reject the application for volunteer membership", async () => {
      const candidates = new InMemoryCandidates([
        leaStaffCandidate,
        leaVolunteerCandidate,
      ]);
      const reject = new RejectMembershipApplication(candidates);
      await reject.applyOne(lea, VOLUNTEER);
      const expected = { ...leaVolunteerCandidate, isRejected: true };
      expect(candidates.volunteers).toContainEqual(expected);
      expect(candidates.staffs).toContainEqual(leaStaffCandidate);
    });
  });
});

describe("Cancel one membership application rejection", () => {
  describe("when a candidate has been rejected for staff membership for the current edition", () => {
    it("should cancel the rejection", async () => {
      const candidates = new InMemoryCandidates([rejectedOlopStaffCandidate]);
      const reject = new RejectMembershipApplication(candidates);
      await reject.unapplyOne(olop, STAFF);
      const expected = { ...rejectedOlopStaffCandidate, isRejected: false };
      expect(candidates.staffs).toContainEqual(expected);
    });
  });

  describe("when a candidate has been rejected for volunteer membership for the current edition", () => {
    it("should cancel the rejection", async () => {
      const candidates = new InMemoryCandidates([rejectedDnamraCandidate]);
      const reject = new RejectMembershipApplication(candidates);
      await reject.unapplyOne(dnamra, VOLUNTEER);
      const expected = { ...rejectedDnamraCandidate, isRejected: false };
      expect(candidates.volunteers).toContainEqual(expected);
    });
  });

  describe("when a candidate is not rejected for staff membership for the current edition", () => {
    it("should indicate that the candidate is not rejected for staff membership for this edition", () => {
      const candidates = new InMemoryCandidates([leaStaffCandidate]);
      const reject = new RejectMembershipApplication(candidates);
      expect(async () => reject.unapplyOne(lea, STAFF)).rejects.toThrowError(
        new NotRejected(STAFF),
      );
    });
  });

  describe("when a candidate is not rejected for volunteer membership for the current edition", () => {
    it("should indicate that the candidate is not rejected for volunteer membership for this edition", () => {
      const candidates = new InMemoryCandidates([oelCandidate]);
      const reject = new RejectMembershipApplication(candidates);
      expect(async () =>
        reject.unapplyOne(oel, VOLUNTEER),
      ).rejects.toThrowError(new NotRejected(VOLUNTEER));
    });
  });

  describe("when a candidate has been rejected for staff and volunteer membership for the current edition", () => {
    it("should cancel the rejection for staff membership", async () => {
      const candidates = new InMemoryCandidates([
        rejectedOlopStaffCandidate,
        rejectedOlopVolunteerCandidate,
      ]);
      const reject = new RejectMembershipApplication(candidates);
      await reject.unapplyOne(olop, STAFF);
      const expected = { ...rejectedOlopStaffCandidate, isRejected: false };
      expect(candidates.staffs).toContainEqual(expected);
      expect(candidates.volunteers).toContainEqual(
        rejectedOlopVolunteerCandidate,
      );
    });

    it("should cancel the rejection for volunteer membership", async () => {
      const candidates = new InMemoryCandidates([
        rejectedOlopStaffCandidate,
        rejectedOlopVolunteerCandidate,
      ]);
      const reject = new RejectMembershipApplication(candidates);
      await reject.unapplyOne(olop, VOLUNTEER);
      const expected = { ...rejectedOlopVolunteerCandidate, isRejected: false };
      expect(candidates.volunteers).toContainEqual(expected);
      expect(candidates.staffs).toContainEqual(rejectedOlopStaffCandidate);
    });
  });
});
