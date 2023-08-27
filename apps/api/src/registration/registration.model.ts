import { ApiProperty } from "@nestjs/swagger";
import {
  EnrollNewcomersForm,
  IDefineANewcomer,
  NewcomerToEnroll,
  Teams,
  JoinableTeam,
} from "@overbookd/registration";

export class NewcomerRepresentation implements IDefineANewcomer {
  id: number;
  firstname: string;
  lastname: string;
  registeredAt: Date;
  teams: Teams;
}

export class NewcomerToEnrollRepresentation implements NewcomerToEnroll {
  @ApiProperty({ required: true })
  id: number;
}

export class EnrollNewcomersFormRepresentation implements EnrollNewcomersForm {
  @ApiProperty({
    required: true,
    type: NewcomerToEnrollRepresentation,
    isArray: true,
  })
  newcomers: NewcomerToEnroll[];

  @ApiProperty({ required: true })
  team: JoinableTeam;
}
