import { HARD, SOFT } from "@overbookd/team-code";

export type JoinableTeam = typeof SOFT | typeof HARD;

export const joinableTeams: Record<string, JoinableTeam> = {
  SOFT,
  HARD,
};
