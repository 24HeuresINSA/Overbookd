import { StaffCandidate, VolunteerCandidate } from "@overbookd/http";

export type EnrollCandidatesRepository = {
  findStaffCandidates: () => Promise<StaffCandidate[]>;
  countStaffCandidates: () => Promise<number>;
  hasStaffApplication: (email: string) => Promise<boolean>;
  findRejectedStaffCandidates: () => Promise<StaffCandidate[]>;
  findVolunteerCandidates: () => Promise<VolunteerCandidate[]>;
  countVolunteerCandidates: () => Promise<number>;
  findRejectedVolunteerCandidates: () => Promise<VolunteerCandidate[]>;
  hasVolunteerApplication: (email: string) => Promise<boolean>;
};
