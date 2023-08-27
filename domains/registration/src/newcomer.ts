import { TeamCode } from "./register-form";

export type Teams = [] | [TeamCode] | [TeamCode, TeamCode];

export interface IDefineANewcomer {
  id: number;
  firstName: string;
  lastName: string;
  registeredAt: Date;
  teams: Teams;
}

export function isJoinableTeams(teams: TeamCode[]): teams is Teams {
  return teams.length <= 2;
}
