import { ApiProperty } from "@nestjs/swagger";
import { User } from "@overbookd/user";
import { UserNameResponseDto } from "./user-name.response.dto";

export class UserIdentifierResponseDto
  extends UserNameResponseDto
  implements User
{
  @ApiProperty({
    required: true,
    description: "user id",
    type: Number,
  })
  id: number;
}
