import { IDefineANewcomer, TeamCode } from "@overbookd/registration";

export type NewcomerTeams = [] | [TeamCode] | [TeamCode, TeamCode];

export class NewcomerRepresentation implements IDefineANewcomer {
  id: number;
  firstName: string;
  lastName: string;
  registeredAt: Date;
  teams: NewcomerTeams;
}

export interface NewcomerToEnroll {
  id: number;
}

export class NewComerToEnrollRepresentation implements NewcomerToEnroll {
  id: number;
}