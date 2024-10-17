import { StaffCandidate, VolunteerCandidate } from "@overbookd/http";
import { EnrolledCandidate } from "@overbookd/registration";

export type EnrollCandidatesRepository = {
  enroll: (candidates: EnrolledCandidate[]) => Promise<void>;
  findStaffCandidates: () => Promise<StaffCandidate[]>;
  countStaffCandidates: () => Promise<number>;
  findRejectedStaffCandidates: () => Promise<StaffCandidate[]>;
  findVolunteerCandidates: () => Promise<VolunteerCandidate[]>;
  countVolunteerCandidates: () => Promise<number>;
  findRejectedVolunteerCandidates: () => Promise<VolunteerCandidate[]>;
};
