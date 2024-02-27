import { Teams } from "@overbookd/registration";

export type EnrollableAdherent = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  registeredAt: Date;
  teams: Teams;
};
