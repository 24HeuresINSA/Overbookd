import { ApiProperty } from "@nestjs/swagger";
import { UserWithTeams } from "@overbookd/user";

export class FriendResponseDto implements UserWithTeams {
  @ApiProperty({
    required: true,
    description: "The id of the Friend",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The firstname of the Friend",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: "The lastname of the Friend",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: false,
    description: "The nickname of the Friend",
    type: String,
  })
  nickname?: string;

  @ApiProperty({
    required: false,
    description: "The teams of the Friend",
    type: String,
    isArray: true,
  })
  teams: string[];
}
