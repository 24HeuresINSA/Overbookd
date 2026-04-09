import { Candidate } from "./enroll-candidates";
import { JoinableTeam } from "./joinable-team.js";

export type EnrollCandidatesForm = {
  candidates: Candidate[];
  team: JoinableTeam;
};
