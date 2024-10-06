import { JoinableTeam } from "./joinable-team.js";
import { BENEVOLE_CODE } from "@overbookd/team-constants";

export type CandidateToEnroll = {
  id: number;
};

type TeamsAfterEnrollment = [JoinableTeam, typeof BENEVOLE_CODE];

export type EnrolledCandidate = {
  id: number;
  teams: TeamsAfterEnrollment;
};

export class EnrollCandidates {
  private constructor(private readonly candidates: CandidateToEnroll[]) {}

  static with(candidates: CandidateToEnroll[]): EnrollCandidates {
    return new EnrollCandidates(candidates);
  }

  to(team: JoinableTeam): EnrolledCandidate[] {
    return this.candidates.map((candidate) => ({
      ...candidate,
      teams: [team, BENEVOLE_CODE],
    }));
  }
}
