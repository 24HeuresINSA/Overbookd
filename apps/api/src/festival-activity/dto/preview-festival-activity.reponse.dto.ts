import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  DRAFT,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";

class AdherentResponseDto implements Adherent {
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

export class PreviewFestivalActivityResponseDto
  implements PreviewFestivalActivity
{
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: DRAFT,
  })
  status: typeof DRAFT;

  @ApiProperty({
    description: "The festival activity adherent in charge",
    type: AdherentResponseDto,
  })
  adherent: Adherent;

  @ApiProperty({
    description: "The festival activity team code",
    type: String,
  })
  team?: string;
}
