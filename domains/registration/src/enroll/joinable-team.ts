import { HARD, SOFT } from "@overbookd/team-constants";

export type JoinableTeam = typeof SOFT | typeof HARD;

export const joinableTeams: Record<string, JoinableTeam> = {
  SOFT,
  HARD,
};
