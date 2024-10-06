import { IProvidePeriod } from "@overbookd/time";
import { Teams } from "@overbookd/registration";

export type StaffCandidate = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  teams: Teams;
};

export type VolunteerCandidate = StaffCandidate & {
  charisma: number;
  mobilePhone: string;
  registeredAt: Date;
  availabilities: IProvidePeriod[];
  comment?: string;
  birthdate: Date;
  note?: string;
};

export type StaffApplication = {
  email: string;
  token: string;
};
