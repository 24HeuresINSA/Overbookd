import { TeamCode } from "./register-form";

export interface IDefineANewcomer {
  id: number;
  firstName: string;
  lastName: string;
  registeredAt: Date;
  teams: [] | [TeamCode] | [TeamCode, TeamCode];
}
