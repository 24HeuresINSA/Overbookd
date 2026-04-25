import { AssignmentFriend } from "@overbookd/http";
import { UserIdentifierResponseDto } from "../../../common/dto/user-identifier.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AssignmentFriendResponseDto
  extends UserIdentifierResponseDto
  implements AssignmentFriend
{
  @ApiProperty({ type: Boolean })
  isDirectFriend: boolean;
}
