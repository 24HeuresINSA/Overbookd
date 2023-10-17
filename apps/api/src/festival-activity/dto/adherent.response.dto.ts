import { ApiProperty } from "@nestjs/swagger";
import type { Adherent } from "@overbookd/festival-activity";

export class AdherentResponseDto implements Adherent {
  @ApiProperty({
    description: "The adherent id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The adherent firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    description: "The adherent lastname",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    description: "The adherent nickname",
    type: String,
  })
  nickname?: string;
}
