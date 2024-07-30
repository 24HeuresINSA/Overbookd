import { CharismaEventPotentialParticipant } from "@overbookd/http";
import { UserIdentifierResponseDto } from "../../common/dto/user-identifier.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CharismaEventPotentialParticipantResponseDto
  extends UserIdentifierResponseDto
  implements CharismaEventPotentialParticipant
{
  @ApiProperty({
    description: "Current charisma of user",
    example: 10,
  })
  charisma: number;
}
