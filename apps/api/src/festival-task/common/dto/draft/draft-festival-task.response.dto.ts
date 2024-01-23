import { ApiProperty } from "@nestjs/swagger";
import { DRAFT, FestivalTaskDraft } from "@overbookd/festival-event";
import { FestivalActivityResponseDto } from "../festival-activity.response.dto";
import { DraftGeneralResponseDto } from "./draft-general.response.dto";
import { DraftInstructionsResponseDto } from "./draft-instructions.response.dto";
import { KeyEventResponseDto } from "../key-event.response.dto";

export class DraftFestivalTaskResponseDto implements FestivalTaskDraft {
  @ApiProperty({})
  id: FestivalTaskDraft["id"];

  @ApiProperty({ enum: [DRAFT] })
  status: FestivalTaskDraft["status"];

  @ApiProperty({
    description: "The festival activity linked",
    type: FestivalActivityResponseDto,
  })
  festivalActivity: FestivalTaskDraft["festivalActivity"];

  @ApiProperty({
    description: "The festival task general",
    type: DraftGeneralResponseDto,
  })
  general: FestivalTaskDraft["general"];

  @ApiProperty({
    description: "The festival task instructions",
    type: DraftInstructionsResponseDto,
  })
  instructions: FestivalTaskDraft["instructions"];

  mobilizations: FestivalTaskDraft["mobilizations"];

  inquiries: FestivalTaskDraft["inquiries"];

  @ApiProperty({
    description: "Festival activity key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: FestivalTaskDraft["history"];

  feedbacks: FestivalTaskDraft["feedbacks"];
}
