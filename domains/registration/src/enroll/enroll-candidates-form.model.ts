import { JoinableTeam } from "./joinable-team.js";
import { Candidate } from "./enroll-candidates";

export type EnrollCandidatesForm = {
  candidates: Candidate[];
  team: JoinableTeam;
};
