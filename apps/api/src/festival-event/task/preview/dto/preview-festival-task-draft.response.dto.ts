import { ApiProperty } from "@nestjs/swagger";
import { DRAFT, PreviewFestivalTaskDraft } from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";

export class PreviewFestivalTaskDraftResponseDto
  implements PreviewFestivalTaskDraft
{
  @ApiProperty({
    description: "The festival task id",
    type: Number,
  })
  id: PreviewFestivalTaskDraft["id"];

  @ApiProperty({
    description: "The festival task name",
    type: String,
  })
  name: PreviewFestivalTaskDraft["name"];

  @ApiProperty({
    description: "The festival task status",
    enum: [DRAFT],
    example: DRAFT,
  })
  status: typeof DRAFT;

  @ApiProperty({
    description: "The festival task adherent in charge",
    type: AdherentResponseDto,
  })
  administrator: PreviewFestivalTaskDraft["administrator"];

  @ApiProperty({
    description: "The festival task team code",
    type: String,
  })
  team: PreviewFestivalTaskDraft["team"];
}
