import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  IN_REVIEW,
  FestivalTaskInReview as InReview,
  REFUSED,
  FestivalTaskRefused as Refused,
  FestivalTaskReviewable as Reviewable,
} from "@overbookd/festival-event";
import { ReviewableWithConflicts } from "@overbookd/http";
import { ReviewableGeneralResponseDto } from "./reviewable-general.response.dto";
import { FestivalActivityResponseDto } from "../festival-activity.response.dto";
import { ReviewableInstructionsResponseDto } from "./reviewable-instructions.response.dto";
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
type RefusedWithConflicts = Extract<ReviewableWithConflicts, Refused>;
type BaseReviewableWithConflicts = Omit<
  ReviewableWithConflicts,
  "status" | "reviews"
>;

class BaseReviewableWithConflictsResponseDto
  implements BaseReviewableWithConflicts
{
  @ApiProperty({})
  id: Reviewable["id"];

  @ApiProperty({
    description: "The festival task general",
    type: ReviewableGeneralResponseDto,
  })
  general: Reviewable["general"];

  @ApiProperty({
    description: "The festival activity linked",
    type: FestivalActivityResponseDto,
  })
  festivalActivity: Reviewable["festivalActivity"];

  @ApiProperty({
    description: "The festival task instructions",
    type: ReviewableInstructionsResponseDto,
  })
  instructions: Reviewable["instructions"];

  @ApiProperty({
    description: "Festival task key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: Reviewable["history"];

  @ApiProperty({
    description: "The feedbacks",
    isArray: true,
    type: FeedbackResponseDto,
  })
  feedbacks: Reviewable["feedbacks"];

  @ApiProperty({
    description: "The inquiry requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
    isArray: true,
  })
  inquiries: Reviewable["inquiries"];

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
    description: "The festival task reviewer",
    type: AdherentResponseDto,
  })
  reviewer: Reviewable["reviewer"];
}

export class InReviewFestivalTaskResponseDto
  extends BaseReviewableWithConflictsResponseDto
  implements InReviewWithConflicts
{
  @ApiProperty({ enum: [IN_REVIEW] })
  status: InReview["status"];

  @ApiProperty({
    description: "The festival task reviews",
    type: InReviewReviewsResponseDto,
  })
  reviews: InReview["reviews"];
}

export class RefusedFestivalTaskResponseDto
  extends BaseReviewableWithConflictsResponseDto
  implements RefusedWithConflicts
{
  @ApiProperty({ enum: [REFUSED] })
  status: Refused["status"];

  @ApiProperty({
    description: "The festival task reviews",
    type: InReviewReviewsResponseDto,
  })
  reviews: Refused["reviews"];
}
