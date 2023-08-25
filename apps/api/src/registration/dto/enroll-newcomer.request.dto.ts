import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";
import { NewComerToEnrollRepresentation } from "../registration.model";

export class EnrollNewcomerRequestDto
  implements NewComerToEnrollRepresentation
{
  @ApiProperty({
    required: true,
    description: "The newcomer id",
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  id: number;
}
