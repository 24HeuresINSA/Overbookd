import { ApiProperty } from "@nestjs/swagger";
import type {
  Adherent,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { DRAFT } from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";

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
