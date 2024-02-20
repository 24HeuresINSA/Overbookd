import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { IN_REVIEW } from "@overbookd/festival-event";
import { InReviewWithConflicts } from "@overbookd/http";
import { InReviewGeneralResponseDto } from "./reviewable-general.response.dto";
import { FestivalActivityResponseDto } from "../festival-activity.response.dto";
import { InReviewInstructionsResponseDto } from "./reviewable-instructions.response.dto";
import { KeyEventResponseDto } from "../key-event.response.dto";
import {
  UnassignedInquiryRequestResponseDto,
  AssignedInquiryRequestResponseDto,
} from "../inquiry-request.response.dto";
import { InReviewReviewsResponseDto } from "./reviews.response.dto";
import {
  MobilizationWithAtLeastOneTeamDto,
  MobilizationWithAtLeastOneVolunteerDto,
} from "./reviewable-mobilization.response.dto";
import { FeedbackResponseDto } from "../../../../common/dto/feedback.response.dto";
import { AdherentResponseDto } from "../../../../common/dto/adherent.response.dto";

export class ReviewableFestivalTaskResponseDto
  implements InReviewWithConflicts
{
  @ApiProperty({})
  id: InReviewWithConflicts["id"];

  @ApiProperty({ enum: [IN_REVIEW] })
  status: InReviewWithConflicts["status"];

  @ApiProperty({
    description: "The festival task general",
    type: InReviewGeneralResponseDto,
  })
  general: InReviewWithConflicts["general"];

  @ApiProperty({
    description: "The festival activity linked",
    type: FestivalActivityResponseDto,
  })
  festivalActivity: InReviewWithConflicts["festivalActivity"];

  @ApiProperty({
    description: "The festival task instructions",
    type: InReviewInstructionsResponseDto,
  })
  instructions: InReviewWithConflicts["instructions"];

  @ApiProperty({
    description: "Festival activity key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: InReviewWithConflicts["history"];

  @ApiProperty({
    description: "The feedbacks",
    isArray: true,
    type: FeedbackResponseDto,
  })
  feedbacks: InReviewWithConflicts["feedbacks"];

  @ApiProperty({
    description: "The inquiry requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
    isArray: true,
  })
  inquiries: InReviewWithConflicts["inquiries"];

  @ApiProperty({
    description: "The festival task mobilizations",
    isArray: true,
    type: {
      oneOf: [
        { $ref: getSchemaPath(MobilizationWithAtLeastOneVolunteerDto) },
        { $ref: getSchemaPath(MobilizationWithAtLeastOneTeamDto) },
      ],
    },
  })
  mobilizations: InReviewWithConflicts["mobilizations"];

  @ApiProperty({
    description: "The festival task reviews",
    type: InReviewReviewsResponseDto,
  })
  reviews: InReviewWithConflicts["reviews"];

  @ApiProperty({
    description: "The festival task reviewer",
    type: AdherentResponseDto,
  })
  reviewer: InReviewWithConflicts["reviewer"];
}
