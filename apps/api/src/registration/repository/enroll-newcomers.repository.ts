import { EnrollableAdherent } from "@overbookd/http";
import { EnrolledNewcomer } from "@overbookd/registration";

export interface EnrollNewcomersRepository {
  enroll: (newcomers: EnrolledNewcomer[]) => Promise<void>;
  findEnrollableAdherents: () => Promise<EnrollableAdherent[]>;
}
