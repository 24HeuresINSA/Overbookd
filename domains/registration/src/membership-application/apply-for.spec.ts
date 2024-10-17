import { describe, expect, it } from "vitest";
import { Edition } from "@overbookd/time";
import { STAFF, VOLUNTEER } from "../newcomer.js";
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
  oelCandidate,
  culCandidate,
  cul,
  rejectedDnamraCandidate,
} from "./candidate.test-utils.js";

describe("Apply for staff membership", () => {
  describe("when someone is applying for staff membership", () => {
    describe("and the candidate did NOT apply yet", () => {
      it("should be listed as staff candidate", async () => {
        const candidate = { email: "candidate@gmail.com" };
        const expectedCandidate = {
          ...candidate,
          membership: STAFF,
          edition: Edition.current,
          isRejected: false,
        };
        const candidates = new InMemoryCandidates([]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.staff(candidate);
        expect(candidates.staff).toContainEqual(expectedCandidate);
      });
    });

    describe("and the candidate has already applied for the current edition", () => {
      it("should indicate that the candidate has already applied fot this edition", () => {
        const candidates = new InMemoryCandidates([leaCandidate]);
        const applyFor = new ApplyFor(candidates);
        expect(async () => applyFor.staff(lea)).rejects.toThrowError(
          AlreadyCandidate,
        );
      });
    });

    describe("and the candidate has already applied for a previous edition", () => {
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
      it("should indicate that the candidate has already a rejected application", () => {
        const candidates = new InMemoryCandidates([rejectedOlopCandidate]);
        const applyFor = new ApplyFor(candidates);
        expect(async () => applyFor.staff(olop)).rejects.toThrowError(
          AlreadyRejected,
        );
      });
    });
  });
});

describe("Apply for volunteer membership", () => {
  describe("when someone is applying for volunteer membership", () => {
    describe("and the candidate did NOT apply yet", () => {
      it("should be listed as volunteer candidate", async () => {
        const candidate = { email: "candidate@gmail.com" };
        const expectedCandidate = {
          ...candidate,
          membership: VOLUNTEER,
          edition: Edition.current,
          isRejected: false,
        };
        const candidates = new InMemoryCandidates([]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.volunteer(candidate);
        expect(candidates.volunteers).toContainEqual(expectedCandidate);
      });
    });

    describe("and the candidate has already applied for the current edition", () => {
      it("should indicate that the candidate has already applied fot this edition", () => {
        const candidates = new InMemoryCandidates([oelCandidate]);
        const applyFor = new ApplyFor(candidates);
        expect(async () =>
          applyFor.volunteer(oelCandidate),
        ).rejects.toThrowError(AlreadyCandidate);
      });
    });

    describe("and the candidate has already applied for a previous edition", () => {
      it("should be listed as volunteer candidate", async () => {
        const expectedCandidate = {
          ...culCandidate,
          edition: Edition.current,
        };
        const candidates = new InMemoryCandidates([oelCandidate]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.volunteer(cul);
        expect(candidates.volunteers).toContainEqual(expectedCandidate);
      });
    });

    describe("and the application for the current edition is rejected", () => {
      it("should indicate that the candidate has already a rejected application", () => {
        const candidates = new InMemoryCandidates([rejectedDnamraCandidate]);
        const applyFor = new ApplyFor(candidates);
        expect(async () =>
          applyFor.volunteer(rejectedDnamraCandidate),
        ).rejects.toThrowError(AlreadyRejected);
      });
    });
  });
});
