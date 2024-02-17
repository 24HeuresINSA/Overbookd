import { ApiProperty } from "@nestjs/swagger";
import { DRAFT } from "@overbookd/festival-event";
import { DraftWithConflicts } from "@overbookd/http";
import { FestivalActivityResponseDto } from "../festival-activity.response.dto";
import { DraftGeneralResponseDto } from "./draft-general.response.dto";
import { DraftInstructionsResponseDto } from "./draft-instructions.response.dto";
import { KeyEventResponseDto } from "../key-event.response.dto";

export class DraftFestivalTaskResponseDto implements DraftWithConflicts {
  @ApiProperty({})
  id: DraftWithConflicts["id"];

  @ApiProperty({ enum: [DRAFT] })
  status: DraftWithConflicts["status"];

  @ApiProperty({
    description: "The festival activity linked",
    type: FestivalActivityResponseDto,
  })
  festivalActivity: DraftWithConflicts["festivalActivity"];

  @ApiProperty({
    description: "The festival task general",
    type: DraftGeneralResponseDto,
  })
  general: DraftWithConflicts["general"];

  @ApiProperty({
    description: "The festival task instructions",
    type: DraftInstructionsResponseDto,
  })
  instructions: DraftWithConflicts["instructions"];

  mobilizations: DraftWithConflicts["mobilizations"];

  inquiries: DraftWithConflicts["inquiries"];

  @ApiProperty({
    description: "Festival activity key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: DraftWithConflicts["history"];

  feedbacks: DraftWithConflicts["feedbacks"];
}
