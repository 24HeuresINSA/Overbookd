import { IProvidePeriod } from "@overbookd/time";

export type StaffCandidate = {
  id: number;
  firstname: string;
  lastname: string;
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
