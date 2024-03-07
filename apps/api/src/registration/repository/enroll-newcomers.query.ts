import { BENEVOLE_CODE, TeamCode } from "@overbookd/registration";
import { SELECT_USER_TEAMS } from "../../user/user.query";
import { IProvidePeriod } from "@overbookd/period";

export const SELECT_ADHERENT = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  createdAt: true,
  ...SELECT_USER_TEAMS,
};

export const SELECT_VOLUNTEER = {
  ...SELECT_ADHERENT,
  charisma: true,
  availabilities: { select: { start: true, end: true } },
  phone: true,
  birthdate: true,
  comment: true,
};

export const NOT_VOLUNTEER_YET = {
  teams: { none: { team: { code: BENEVOLE_CODE } } },
};

export type DatabaseEnrollableAdherent = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
  teams: DatabaseTeamCode[];
};

export type DatabaseEnrollableVolunteer = DatabaseEnrollableAdherent & {
  availabilities: IProvidePeriod[];
  charisma: number;
  phone: string;
  comment: string | null;
  birthdate: Date;
};

export type DatabaseTeamCode = { team: { code: TeamCode } };
