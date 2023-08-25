import { ApiProperty } from "@nestjs/swagger";
import { NewcomerRepresentation, NewcomerTeams } from "../registration.model";

export class NewcomerResponseDto implements NewcomerRepresentation {

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
  firstName: string;

  @ApiProperty({
    required: true,
    description: "The newcomer lastname",
    type: String,
  })
  lastName: string;

  @ApiProperty({
    required: true,
    description: "The newcomer register date",
    type: Date,
  })
  registeredAt: Date;

  @ApiProperty({
    required: true,
    description: "The newcomer teams",
    example: [],
  })
  teams: NewcomerTeams;
}
