import { TeamCode } from "@overbookd/registration";
import { SELECT_USER_TEAMS } from "../../user/user.query";

export const SELECT_NEWCOMER = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  createdAt: true,
  ...SELECT_USER_TEAMS,
};

export interface DatabaseNewcomer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
  teams: DatabaseTeamCode[];
}

export type DatabaseTeamCode = { team: { code: TeamCode } };
