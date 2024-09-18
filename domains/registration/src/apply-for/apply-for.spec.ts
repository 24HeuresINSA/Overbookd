import { describe, expect, it } from "vitest";
import { STAFF } from "../newcomer.js";
import { InMemoryCandidates } from "./candidates.inmemory.js";
import { Candidate, ApplyFor } from "./apply-for.js";
import { Edition } from "@overbookd/time";
import { AlreadyCandidate } from "./candidature.error.js";

const lea = { email: "lea.mouyno@gmail.com" };
const leaCandidate: Candidate = {
  ...lea,
  membership: STAFF,
  edition: Edition.current,
};
const noel = { email: "noel.ertsemud@gmail.com" };
const previousEdition = Edition.current - 1;
const noelCandidate: Candidate = {
  ...noel,
  membership: STAFF,
  edition: previousEdition,
};

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
  });
});
