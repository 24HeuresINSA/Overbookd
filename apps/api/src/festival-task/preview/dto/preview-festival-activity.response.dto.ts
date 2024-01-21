import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  DRAFT,
  PreviewFestivalTaskDraft,
} from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../common/dto/adherent.response.dto";

export class PreviewFestivalTaskResponseDto
  implements PreviewFestivalTaskDraft
{
  @ApiProperty({
    description: "The festival task id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The festival task name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The festival task status",
    type: String,
    example: DRAFT,
  })
  status: typeof DRAFT;

  @ApiProperty({
    description: "The festival task adherent in charge",
    type: AdherentResponseDto,
  })
  administrator: Adherent;

  @ApiProperty({
    description: "The festival task team code",
    type: String,
  })
  team: string | null;
}
