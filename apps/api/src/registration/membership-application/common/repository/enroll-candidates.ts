import { StaffCandidate, VolunteerCandidate } from "@overbookd/http";
import { EnrolledCandidate } from "@overbookd/registration";

export type EnrollCandidatesRepository = {
  enroll: (newcomers: EnrolledCandidate[]) => Promise<void>;
  findStaffCandidates: () => Promise<StaffCandidate[]>;
  countStaffCandidates: () => Promise<number>;
  findRejectedStaffCandidates: () => Promise<StaffCandidate[]>;
  findVolunteerCandidates: () => Promise<VolunteerCandidate[]>;
  findVolunteerCandidate: (
    volunteerId: VolunteerCandidate["id"],
  ) => Promise<VolunteerCandidate | null>;
};
