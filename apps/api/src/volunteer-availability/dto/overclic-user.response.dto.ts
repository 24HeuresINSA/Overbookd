import { ApiProperty } from "@nestjs/swagger";
import { OverClicUser } from "@overbookd/volunteer-availability";
import { UserIdentifierResponseDto } from "../../common/dto/user-identifier.response.dto";

export class OverClicUserResponseDto
  extends UserIdentifierResponseDto
  implements OverClicUser
{
  @ApiProperty({
    required: false,
    description: "The profile picture url of the user",
    type: String,
    nullable: true,
  })
  profilePicture?: string | null;
}
