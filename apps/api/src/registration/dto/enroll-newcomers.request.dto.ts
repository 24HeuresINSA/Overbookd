import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined } from "class-validator";
import { EnrollNewcomersForm, NewcomerToEnroll } from "@overbookd/registration";

class NewcomerToEnrollRepresentation implements NewcomerToEnroll {
  @ApiProperty({ required: true })
  id: number;
}

export class EnrollNewcomersRequestDto
  implements Pick<EnrollNewcomersForm, "newcomers">
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
}
