import { JoinableTeam } from "./joinable-team.js";
import { CandidateToEnroll } from "./enroll-candidates.js";

export type EnrollCandidatesForm = {
  candidates: CandidateToEnroll[];
  team: JoinableTeam;
};
