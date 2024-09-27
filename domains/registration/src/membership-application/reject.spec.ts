import { describe, expect, it } from "vitest";
import { InMemoryCandidates } from "./candidates.inmemory.js";
import { lea, leaCandidate } from "./candidate.test-utils.js";
import { RejectMembershipApplication } from "./reject.js";
import { NotCandidate } from "./candidature.error.js";

describe("Reject membership application", () => {
  describe("when a candidate has applied for staff membership for the current edition", () => {
    it("should reject the application", async () => {
      const candidates = new InMemoryCandidates([leaCandidate]);
      const cancel = new RejectMembershipApplication(candidates);
      await cancel.applyOne(lea);
      const expected = { ...leaCandidate, isRejected: true };
      expect(candidates.staff).toContainEqual(expected);
    });
  });
  describe("when a candidate has not applied for staff membership for the current edition", () => {
    it("should indicate that the candidate did not apply for this edition", () => {
      const candidates = new InMemoryCandidates([]);
      const cancel = new RejectMembershipApplication(candidates);
      expect(async () => cancel.applyOne(lea)).rejects.toThrowError(
        NotCandidate,
      );
    });
  });
});
