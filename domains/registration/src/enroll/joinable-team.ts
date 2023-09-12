const SOFT_CODE = "soft";
const HARD_CODE = "hard";

export type JoinableTeam = typeof SOFT_CODE | typeof HARD_CODE;

export const joinableTeams: Record<string, JoinableTeam> = {
  SOFT_CODE,
  HARD_CODE,
};
