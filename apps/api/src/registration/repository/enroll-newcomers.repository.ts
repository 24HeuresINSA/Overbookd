import { EnrolledNewcomer, IDefineANewcomer } from "@overbookd/registration";

export interface EnrollNewcomersRepository {
  enroll: (newcomers: EnrolledNewcomer[]) => Promise<void>;
  findEnrollable: () => Promise<IDefineANewcomer[]>;
}
