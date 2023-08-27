import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined, IsString } from "class-validator";
import {
  EnrollNewcomersFormRepresentation,
  NewcomerToEnrollRepresentation,
} from "../registration.model";
import { JoinableTeam, NewcomerToEnroll } from "@overbookd/registration";

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
  @IsString()
  team: JoinableTeam;
}
