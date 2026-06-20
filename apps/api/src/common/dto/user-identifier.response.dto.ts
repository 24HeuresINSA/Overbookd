import { ApiProperty } from "@nestjs/swagger";
import { User } from "@overbookd/user";

export class UserIdentifierResponseDto implements User {
  @ApiProperty({
    required: true,
    description: "user id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "user first name",
    type: String,
  })
  firstName: string;

  @ApiProperty({
    required: true,
    description: "user last name",
    type: String,
  })
  lastName: string;

  @ApiProperty({
    required: false,
    description: "user nickname",
    type: String,
  })
  nickname?: string;
}
