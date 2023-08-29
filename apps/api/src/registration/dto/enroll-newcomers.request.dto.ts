import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsDefined,
  IsEnum,
  ValidationArguments,
} from "class-validator";
import {
  EnrollNewcomersFormRepresentation,
  NewcomerToEnrollRepresentation,
} from "../registration.model";
import {
  JoinableTeam,
  joinableTeams,
  NewcomerToEnroll,
} from "@overbookd/registration";

export class EnrollNewcomersRequestDto
  implements EnrollNewcomersFormRepresentation
{
  @ApiProperty({
    required: true,
    description: "Newcomers to enroll",
    type: NewcomerToEnrollRepresentation,
    isArray: true,
  })
  @IsDefined()
  @IsArray()
  newcomers: NewcomerToEnroll[];

  @ApiProperty({
    required: true,
    description: "The team to enroll newcomers to",
    type: String,
  })
  @IsDefined()
  @IsEnum(joinableTeams, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(joinableTeams)}`,
  })
  team: JoinableTeam;
}
