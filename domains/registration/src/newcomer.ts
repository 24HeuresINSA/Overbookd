import { TeamCode } from "./registree";

export interface IDefineANewcomer {
  id: number;
  firstName: string;
  lastName: string;
  registeredAt: Date;
  teams: TeamCode[];
}
