const SOFT_CODE = "soft";
const HARD_CODE = "hard";
const CONFIANCE_CODE = "confiance";

export type JoinableTeam =
  | typeof SOFT_CODE
  | typeof HARD_CODE
  | typeof CONFIANCE_CODE;

export const joinableTeams: Record<string, JoinableTeam> = {
  SOFT_CODE,
  HARD_CODE,
  CONFIANCE_CODE,
};
