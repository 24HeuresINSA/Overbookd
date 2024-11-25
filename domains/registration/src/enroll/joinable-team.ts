import { HARD_CODE, BENEVOLE_FESTIVAL_CODE } from "@overbookd/team-constants";

export type JoinableTeam = typeof BENEVOLE_FESTIVAL_CODE | typeof HARD_CODE;

export const joinableTeams: Record<string, JoinableTeam> = {
  BENEVOLE_FESTIVAL_CODE,
  HARD_CODE,
};
