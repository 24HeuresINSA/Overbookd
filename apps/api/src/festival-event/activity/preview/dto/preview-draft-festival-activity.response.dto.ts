import { ApiProperty } from "@nestjs/swagger";
import { Adherent, PreviewDraft } from "@overbookd/festival-event";
import { DRAFT } from "@overbookd/festival-event-constants";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";

export class DraftPreviewFestivalActivityResponseDto implements PreviewDraft {
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
  team: string | null;

  @ApiProperty({
    description: "The festival activity supply need",
    type: Boolean,
  })
  needSupply: boolean;
}
