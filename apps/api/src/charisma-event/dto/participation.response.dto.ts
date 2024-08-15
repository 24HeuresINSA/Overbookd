import { ApiProperty } from "@nestjs/swagger";
import { CharismaEventParticipation } from "@overbookd/charisma";
import { User } from "@overbookd/user";
import { UserIdentifierResponseDto } from "../../common/dto/user-identifier.response.dto";
import { DateString } from "@overbookd/time";

export class CharismaEventParticipationResponseDto
  implements CharismaEventParticipation
{
  @ApiProperty({ example: "comptage-velo-1" })
  slug: string;

  @ApiProperty({ example: "Comptage vélo #1" })
  name: string;

  @ApiProperty({ type: UserIdentifierResponseDto })
  participant: User;

  @ApiProperty({ example: 10 })
  charisma: number;

  @ApiProperty()
  eventDate: DateString;
}
