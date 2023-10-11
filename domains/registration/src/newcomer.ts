import { TeamCode, Teams } from "./register-form";

export interface IDefineANewcomer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  registeredAt: Date;
  teams: Teams;
}

export function isJoinableTeams(teams: TeamCode[]): teams is Teams {
  return teams.length <= 2;
}
