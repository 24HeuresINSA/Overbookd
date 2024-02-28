import { EnrollableAdherent, EnrollableVolunteer } from "@overbookd/http";
import { EnrolledNewcomer } from "@overbookd/registration";

export interface EnrollNewcomersRepository {
  enroll: (newcomers: EnrolledNewcomer[]) => Promise<void>;
  findEnrollableAdherents: () => Promise<EnrollableAdherent[]>;
  findEnrollableVolunteers: () => Promise<EnrollableVolunteer[]>;
}
