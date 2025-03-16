import { IProvidePeriod } from "@overbookd/time";
import { User } from "@overbookd/user";

export type StaffCandidate = User & {
  email: string;
  candidatedAt: Date;
  teams: string[];
};

export type VolunteerCandidate = StaffCandidate & {
  charisma: number;
  mobilePhone: string;
  availabilities: IProvidePeriod[];
  comment?: string;
  birthdate: Date;
  note?: string;
};

export type StaffApplication = {
  email: string;
  token: string;
};

export type HasApplication = { hasApplication: boolean };
