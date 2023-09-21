import { ApiProperty } from "@nestjs/swagger";
import { Adherent } from "@overbookd/contribution";

export class AdherentResponseDto implements Adherent {
  @ApiProperty({
    description: "Adherent id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "Adherent firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    description: "Adherent lastname",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    description: "Adherent nickname",
    type: String,
    required: false,
  })
  nickname?: string;
}
