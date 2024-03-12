import { IProvidePeriod } from "@overbookd/period";
import { Teams } from "@overbookd/registration";

export type EnrollableStaff = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  registeredAt: Date;
  teams: Teams;
};

export type EnrollableVolunteer = EnrollableStaff & {
  charisma: number;
  mobilePhone: string;
  availabilities: IProvidePeriod[];
  comment?: string;
  birthdate: Date;
};
