import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  IN_REVIEW,
  FestivalTaskInReview as InReview,
} from "@overbookd/festival-event";
import { ReviewableWithConflicts } from "@overbookd/http";
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

type InReviewWithConflicts = Extract<ReviewableWithConflicts, InReview>;

export class InReviewFestivalTaskResponseDto implements InReviewWithConflicts {
  @ApiProperty({})
  id: InReview["id"];

  @ApiProperty({ enum: [IN_REVIEW] })
  status: InReview["status"];

  @ApiProperty({
    description: "The festival task general",
    type: InReviewGeneralResponseDto,
  })
  general: InReview["general"];

  @ApiProperty({
    description: "The festival activity linked",
    type: FestivalActivityResponseDto,
  })
  festivalActivity: InReview["festivalActivity"];

  @ApiProperty({
    description: "The festival task instructions",
    type: InReviewInstructionsResponseDto,
  })
  instructions: InReview["instructions"];

  @ApiProperty({
    description: "Festival activity key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: InReview["history"];

  @ApiProperty({
    description: "The feedbacks",
    isArray: true,
    type: FeedbackResponseDto,
  })
  feedbacks: InReview["feedbacks"];

  @ApiProperty({
    description: "The inquiry requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
    isArray: true,
  })
  inquiries: InReview["inquiries"];

  @ApiProperty({
    description: "The festival task mobilizations",
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(MobilizationWithAtLeastOneVolunteerDto) },
      { $ref: getSchemaPath(MobilizationWithAtLeastOneTeamDto) },
    ],
  })
  mobilizations: ReviewableWithConflicts["mobilizations"];

  @ApiProperty({
    description: "The festival task reviews",
    type: InReviewReviewsResponseDto,
  })
  reviews: InReview["reviews"];

  @ApiProperty({
    description: "The festival task reviewer",
    type: AdherentResponseDto,
  })
  reviewer: InReview["reviewer"];
}
