import { EnrollableStaff, EnrollableVolunteer } from "@overbookd/http";
import { EnrolledNewcomer } from "@overbookd/registration";

export interface EnrollNewcomersRepository {
  enroll: (newcomers: EnrolledNewcomer[]) => Promise<void>;
  findEnrollableStaffs: () => Promise<EnrollableStaff[]>;
  findEnrollableVolunteers: () => Promise<EnrollableVolunteer[]>;
  findEnrollableVolunteer: (
    volunteerId: EnrollableVolunteer["id"],
  ) => Promise<EnrollableVolunteer | null>;
}
