import { ApiProperty } from "@nestjs/swagger";
import { IDefineANewcomer, Teams } from "@overbookd/registration";

export class NewcomerResponseDto implements IDefineANewcomer {
  @ApiProperty({
    required: true,
    description: "The newcomer id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The newcomer firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: "The newcomer lastname",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: "The newcomer email",
    type: String,
  })
  email: string;

  @ApiProperty({
    required: true,
    description: "The newcomer register date",
    type: Date,
  })
  registeredAt: Date;

  @ApiProperty({
    required: true,
    description: "The newcomer teams",
    example: ["teckos"],
  })
  teams: Teams;
}
