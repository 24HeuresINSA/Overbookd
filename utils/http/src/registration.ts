import { IProvidePeriod } from "@overbookd/period";
import { Teams } from "@overbookd/registration";

export type EnrollableAdherent = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  registeredAt: Date;
  teams: Teams;
};

export type EnrollableVolunteer = EnrollableAdherent & {
  charisma: number;
  mobilePhone: string;
  availabilities: IProvidePeriod[];
  comment?: string;
  birthdate: Date;
};
