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
    description: "user firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: "user lastname",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: false,
    description: "user nickname",
    type: String,
  })
  nickname?: string;
}
