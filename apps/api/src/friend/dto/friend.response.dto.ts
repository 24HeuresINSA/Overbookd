import { ApiProperty } from "@nestjs/swagger";
import { Friend } from "@overbookd/user";

export class FriendResponseDto implements Friend {
  @ApiProperty({
    required: true,
    description: "The id of the Friend",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The first name of the Friend",
    type: String,
  })
  firstName: string;

  @ApiProperty({
    required: true,
    description: "The last name of the Friend",
    type: String,
  })
  lastName: string;

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

  @ApiProperty({
    required: false,
    description: "The profile picture url of the Friend",
    type: String,
    nullable: true,
  })
  profilePicture?: string | null;
}
