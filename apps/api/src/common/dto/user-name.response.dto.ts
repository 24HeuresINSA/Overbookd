import { ApiProperty } from "@nestjs/swagger";
import { UserName } from "@overbookd/user";

export class UserNameResponseDto implements UserName {
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
