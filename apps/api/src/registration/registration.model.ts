import { IDefineANewcomer, Teams } from "@overbookd/registration";

export class NewcomerRepresentation implements IDefineANewcomer {
  id: number;
  firstName: string;
  lastName: string;
  registeredAt: Date;
  teams: Teams;
}

export interface NewcomerToEnroll {
  id: number;
}

export class NewComerToEnrollRepresentation implements NewcomerToEnroll {
  id: number;
}
