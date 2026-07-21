import { IProvidePeriod } from "@overbookd/time";
import { UserWithTeams } from "@overbookd/user";

export type StaffCandidate = UserWithTeams & {
  email: string;
  candidatedAt: Date;
};

export type VolunteerCandidate = StaffCandidate & {
  charisma: number;
  mobilePhone: string;
  availabilities: IProvidePeriod[];
  comment?: string;
  birthDate?: Date;
  note?: string;
};

export type HasApplication = { hasApplication: boolean };
