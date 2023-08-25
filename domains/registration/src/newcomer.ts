import { TeamCode } from "./registree";

const SOFT_CODE = "soft";
const HARD_CODE = "hard";
const CONFIANCE_CODE = "confiance";

export type JoinableTeam =
  | typeof SOFT_CODE
  | typeof HARD_CODE
  | typeof CONFIANCE_CODE;

export interface IDefineANewcomer {
  id: number;
  firstName: string;
  lastName: string;
  registeredAt: Date;
  teams: TeamCode[];
}
