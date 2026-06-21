import { ApiProperty } from "@nestjs/swagger";
import type { Adherent } from "@overbookd/festival-event";

export class AdherentResponseDto implements Adherent {
  @ApiProperty({
    description: "The adherent id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The adherent first name",
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: "The adherent last name",
    type: String,
  })
  lastName: string;

  @ApiProperty({
    description: "The adherent nickname",
    type: String,
    required: false,
  })
  nickname?: string;
}
