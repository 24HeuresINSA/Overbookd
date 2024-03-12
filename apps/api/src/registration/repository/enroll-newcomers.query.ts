import { BENEVOLE_CODE, VOLUNTEER } from "@overbookd/registration";
import { SELECT_USER_TEAMS } from "../../user/user.query";
import { IProvidePeriod } from "@overbookd/period";

export const SELECT_STAFF = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  createdAt: true,
  ...SELECT_USER_TEAMS,
};

export const SELECT_VOLUNTEER = {
  ...SELECT_STAFF,
  charisma: true,
  availabilities: { select: { start: true, end: true } },
  phone: true,
  birthdate: true,
  comment: true,
};

export const NOT_VOLUNTEER_YET = {
  teams: { none: { team: { code: BENEVOLE_CODE } } },
};

export const IS_ENROLLABLE_VOLUNTEER = {
  isDeleted: false,
  OR: [
    { registrationMembership: null },
    { registrationMembership: VOLUNTEER } as const,
  ],
  ...NOT_VOLUNTEER_YET,
};

export type DatabaseEnrollableStaff = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
  teams: DatabaseTeamCode[];
};

export type DatabaseEnrollableVolunteer = DatabaseEnrollableStaff & {
  availabilities: IProvidePeriod[];
  charisma: number;
  phone: string;
  comment: string | null;
  birthdate: Date;
};

export type DatabaseTeamCode = { team: { code: string } };
