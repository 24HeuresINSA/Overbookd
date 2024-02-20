import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { DRAFT, FestivalTaskDraft as Draft } from "@overbookd/festival-event";
import { DraftWithConflicts } from "@overbookd/http";
import { FestivalActivityResponseDto } from "../festival-activity.response.dto";
import { DraftGeneralResponseDto } from "./draft-general.response.dto";
import { DraftInstructionsResponseDto } from "./draft-instructions.response.dto";
import { KeyEventResponseDto } from "../key-event.response.dto";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "../inquiry-request.response.dto";
import { DraftMobilizationResponseDto } from "./draft-mobilization.response.dto";
import { FeedbackResponseDto } from "../../../../common/dto/feedback.response.dto";

export class DraftFestivalTaskResponseDto implements DraftWithConflicts {
  @ApiProperty({})
  id: Draft["id"];

  @ApiProperty({ enum: [DRAFT] })
  status: Draft["status"];

  @ApiProperty({
    description: "The festival activity linked",
    type: FestivalActivityResponseDto,
  })
  festivalActivity: Draft["festivalActivity"];

  @ApiProperty({
    description: "The festival task general",
    type: DraftGeneralResponseDto,
  })
  general: Draft["general"];

  @ApiProperty({
    description: "The festival task instructions",
    type: DraftInstructionsResponseDto,
  })
  instructions: Draft["instructions"];

  @ApiProperty({
    description: "The festival task mobilizations",
    type: DraftMobilizationResponseDto,
    isArray: true,
  })
  mobilizations: DraftWithConflicts["mobilizations"];

  @ApiProperty({
    description: "The inquiry requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
    isArray: true,
  })
  inquiries: Draft["inquiries"];

  @ApiProperty({
    description: "Festival activity key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: Draft["history"];

  @ApiProperty({
    description: "The feedbacks",
    isArray: true,
    type: FeedbackResponseDto,
  })
  feedbacks: Draft["feedbacks"];
}
