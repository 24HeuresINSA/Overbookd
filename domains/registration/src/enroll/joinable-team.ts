import { HARD_CODE, SOFT_CODE } from "@overbookd/team-constants";

export type JoinableTeam = typeof SOFT_CODE | typeof HARD_CODE;

export const joinableTeams: Record<string, JoinableTeam> = {
  SOFT_CODE,
  HARD_CODE,
};
