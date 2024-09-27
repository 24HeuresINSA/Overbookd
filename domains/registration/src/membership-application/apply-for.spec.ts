import { describe, expect, it } from "vitest";
import { Edition } from "@overbookd/time";
import { STAFF } from "../newcomer.js";
import { InMemoryCandidates } from "./candidates.inmemory.js";
import { ApplyFor } from "./apply-for.js";
import { AlreadyRejected, AlreadyCandidate } from "./candidature.error.js";
import {
  rejectedOlopCandidate,
  lea,
  leaCandidate,
  noel,
  noelCandidate,
  olop,
} from "./candidate.test-utils.js";

describe("Apply for staff membership", () => {
  describe("when someone is applying for staff membership", () => {
    describe("and the candidate did NOT apply yet", () => {
      it("should be listed as staff candidate", async () => {
        const candidate = { email: "candidate@gmail.com" };
        const candidates = new InMemoryCandidates([]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.staff(candidate);
        expect(candidates.staff).toContainEqual({
          ...candidate,
          membership: STAFF,
          edition: Edition.current,
          isRejected: false,
        });
      });
    });

    describe("and the candidate already applied for the current edition", () => {
      const candidates = new InMemoryCandidates([leaCandidate]);
      const applyFor = new ApplyFor(candidates);
      it("indicate that the candidate already applied fot this edition", () => {
        expect(async () => applyFor.staff(lea)).rejects.toThrowError(
          AlreadyCandidate,
        );
      });
    });

    describe("and the candidate already applied for a previous edition", () => {
      it("should be listed as staff candidate", async () => {
        const expectedCandidate = {
          ...noelCandidate,
          edition: Edition.current,
        };
        const candidates = new InMemoryCandidates([noelCandidate]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.staff(noel);
        expect(candidates.staff).toContainEqual(expectedCandidate);
      });
    });

    describe("and the application for the current edition is rejected", () => {
      const candidates = new InMemoryCandidates([rejectedOlopCandidate]);
      const applyFor = new ApplyFor(candidates);
      it("should indicate that the candidate has already a rejected application", () => {
        expect(async () => applyFor.staff(olop)).rejects.toThrowError(
          AlreadyRejected,
        );
      });
    });
  });
});
