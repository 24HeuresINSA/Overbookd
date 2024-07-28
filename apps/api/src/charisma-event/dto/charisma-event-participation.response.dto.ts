import { ApiProperty } from "@nestjs/swagger";
import { CharismaEventParticipation } from "@overbookd/charisma";
import { User } from "@overbookd/user";
import { BaseUserResponseDto } from "../../user/dto/base-user.response.dto";

export class CharismaEventParticipationResponseDto
  implements CharismaEventParticipation
{
  @ApiProperty({ example: "comptage-velo-1" })
  slug: string;

  @ApiProperty({ example: "Comptage vélo #1" })
  name: string;

  @ApiProperty({ type: BaseUserResponseDto })
  participant: User;

  @ApiProperty({ example: 10 })
  charisma: number;

  @ApiProperty()
  eventDate: Date;
}
