import { StaffCandidate, VolunteerCandidate } from "@overbookd/http";

export type EnrollCandidatesRepository = {
  findStaffCandidates: () => Promise<StaffCandidate[]>;
  countStaffCandidates: () => Promise<number>;
  findRejectedStaffCandidates: () => Promise<StaffCandidate[]>;
  findVolunteerCandidates: () => Promise<VolunteerCandidate[]>;
  countVolunteerCandidates: () => Promise<number>;
  findRejectedVolunteerCandidates: () => Promise<VolunteerCandidate[]>;
};
