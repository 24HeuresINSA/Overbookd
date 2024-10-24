import { describe, expect, it } from "vitest";
import { Edition } from "@overbookd/time";
import { STAFF, VOLUNTEER } from "../newcomer.js";
import { InMemoryCandidates } from "./candidates.inmemory.js";
import { ApplyFor } from "./apply-for.js";
import { AlreadyCandidate, Rejected } from "./candidature.error.js";
import {
  rejectedOlopStaffCandidate,
  lea,
  leaStaffCandidate,
  noel,
  noelCandidate,
  olop,
  oelCandidate,
  culCandidate,
  cul,
  rejectedDnamraCandidate,
  oel,
  dnamra,
} from "./candidate.test-utils.js";

describe("Apply for staff membership", () => {
  describe("when someone is applying for staff membership", () => {
    describe("and the candidate did NOT apply yet", () => {
      it("should be listed as staff candidate", async () => {
        const candidateEmail = { email: "candidate@gmail.com" };
        const expectedCandidate = {
          ...candidateEmail,
          membership: STAFF,
          edition: Edition.current,
          isRejected: false,
          candidatedAt: expect.any(Date),
        };
        const candidates = new InMemoryCandidates([]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.staff(candidateEmail);
        expect(candidates.staffs).toContainEqual(expectedCandidate);
      });
    });

    describe("and the candidate has already applied for the current edition", () => {
      it("should indicate that the candidate has already applied fot this edition", () => {
        const candidates = new InMemoryCandidates([leaStaffCandidate]);
        const applyFor = new ApplyFor(candidates);
        expect(async () => applyFor.staff(lea)).rejects.toThrowError(
          new AlreadyCandidate(STAFF),
        );
      });
    });

    describe("and the candidate has already applied for a previous edition", () => {
      it("should be listed as staff candidate", async () => {
        const expectedCandidate = {
          ...noelCandidate,
          edition: Edition.current,
          candidatedAt: expect.any(Date),
        };
        const candidates = new InMemoryCandidates([noelCandidate]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.staff(noel);
        expect(candidates.staffs).toContainEqual(expectedCandidate);
      });
    });

    describe("and the application for the current edition is rejected", () => {
      it("should indicate that the candidate has already a rejected application", () => {
        const candidates = new InMemoryCandidates([rejectedOlopStaffCandidate]);
        const applyFor = new ApplyFor(candidates);
        expect(async () => applyFor.staff(olop)).rejects.toThrowError(
          new Rejected(STAFF),
        );
      });
    });

    describe("and the candidated has already applied for a volunteer membership for the current edition", () => {
      it("should be listed as a staff candidate", async () => {
        const expectedCandidate = {
          ...oelCandidate,
          membership: STAFF,
          edition: Edition.current,
          candidatedAt: expect.any(Date),
        };
        const candidates = new InMemoryCandidates([oelCandidate]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.staff(oel);
        expect(candidates.staffs).toContainEqual(expectedCandidate);
      });
    });

    describe("and the candidated is already rejected for volunteer membership for for the current edition", () => {
      it("should be listed as a staff candidate", async () => {
        const expectedCandidate = {
          ...rejectedDnamraCandidate,
          membership: STAFF,
          edition: Edition.current,
          isRejected: false,
          candidatedAt: expect.any(Date),
        };
        const candidates = new InMemoryCandidates([rejectedDnamraCandidate]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.staff(dnamra);
        expect(candidates.staffs).toContainEqual(expectedCandidate);
      });
    });
  });
});

describe("Apply for volunteer membership", () => {
  describe("when someone is applying for volunteer membership", () => {
    describe("and the candidate did NOT apply yet", () => {
      it("should be listed as volunteer candidate", async () => {
        const candidateEmail = { email: "candidate@gmail.com" };
        const expectedCandidate = {
          ...candidateEmail,
          membership: VOLUNTEER,
          edition: Edition.current,
          isRejected: false,
          candidatedAt: expect.any(Date),
        };
        const candidates = new InMemoryCandidates([]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.volunteer(candidateEmail);
        expect(candidates.volunteers).toContainEqual(expectedCandidate);
      });
    });

    describe("and the candidate has already applied for the current edition", () => {
      it("should indicate that the candidate has already applied fot this edition", () => {
        const candidates = new InMemoryCandidates([oelCandidate]);
        const applyFor = new ApplyFor(candidates);
        expect(async () =>
          applyFor.volunteer(oelCandidate),
        ).rejects.toThrowError(new AlreadyCandidate(VOLUNTEER));
      });
    });

    describe("and the candidate has already applied for a previous edition", () => {
      it("should be listed as volunteer candidate", async () => {
        const expectedCandidate = {
          ...culCandidate,
          edition: Edition.current,
          candidatedAt: expect.any(Date),
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
        ).rejects.toThrowError(new Rejected(VOLUNTEER));
      });
    });

    describe("and the candidated has already applied for a staff membership for the current edition", () => {
      it("should be listed as a volunteer candidate", async () => {
        const expectedCandidate = {
          ...noelCandidate,
          membership: VOLUNTEER,
          edition: Edition.current,
          candidatedAt: expect.any(Date),
        };
        const candidates = new InMemoryCandidates([noelCandidate]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.volunteer(noel);
        expect(candidates.volunteers).toContainEqual(expectedCandidate);
      });
    });

    describe("and the candidated is already rejected for staff membership for the current edition", () => {
      it("should be listed as a volunteer candidate", async () => {
        const expectedCandidate = {
          ...rejectedOlopStaffCandidate,
          membership: VOLUNTEER,
          edition: Edition.current,
          candidatedAt: expect.any(Date),
          isRejected: false,
        };
        const candidates = new InMemoryCandidates([rejectedOlopStaffCandidate]);
        const applyFor = new ApplyFor(candidates);
        await applyFor.volunteer(olop);
        expect(candidates.volunteers).toContainEqual(expectedCandidate);
      });
    });
  });
});
