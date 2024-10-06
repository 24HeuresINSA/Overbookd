import { beforeEach, describe, expect, it } from "vitest";
import { EnrollCandidates } from "./enroll-candidates.js";
import { BENEVOLE_CODE, HARD_CODE } from "@overbookd/team-constants";

describe("Enroll candidates to a joinable team", () => {
  const candidates = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const team = HARD_CODE;
  let enrollCandidates: EnrollCandidates;

  beforeEach(() => {
    enrollCandidates = EnrollCandidates.with(candidates);
  });

  it("should enroll candidates to the requested joinable team", () => {
    const enrolledCandidates = enrollCandidates.to(team);
    expect(
      enrolledCandidates.every((candidate) => candidate.teams.includes(team)),
    ).toBe(true);
  });

  it("should also enroll candidates to the benevole team", () => {
    const enrolledCandidates = enrollCandidates.to(team);
    expect(
      enrolledCandidates.every((candidate) =>
        candidate.teams.includes(BENEVOLE_CODE),
      ),
    ).toBe(true);
  });
});
