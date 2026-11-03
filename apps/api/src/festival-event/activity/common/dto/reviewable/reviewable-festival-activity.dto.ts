import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  Feedback,
  FestivalActivityInReview,
  InReviewReviews,
  FestivalActivityKeyEvent as KeyEvent,
  FestivalActivityRefused,
  RefusedReviews,
  FestivalActivityReviewable,
  FestivalActivityValidated,
  ValidatedReviews,
} from "@overbookd/festival-event";
import {
  REFUSED,
  IN_REVIEW,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { FeedbackResponseDto } from "../../../../common/dto/feedback.response.dto";
import {
  ActivityInReviewReviewsResponseDto,
  ActivityRefusedReviewsResponseDto,
  ActivityValidatedReviewsResponseDto,
} from "../../../review/dto/reviews.response.dto";
import {
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
} from "./reviewable-general.response.dto";
import { KeyEventResponseDto } from "../key-event.response.dto";
import { InChargeResponseDto } from "./reviewable-in-charge.response.dto";
import { SignaResponseDto } from "./reviewable-signa.response.dto";
import { SecurityResponseDto } from "./reviewable-security.response.dto";
import { SupplyResponseDto } from "./reviewable-supply.response.dto";
import { ReviewableInquiryResponseDto } from "./reviewable-inquiry.response.dto";
import { FestivalTaskResponseDto } from "../festival-task.response.dto";

class ReviewableBaseResponseDto {
  @ApiProperty({ required: true })
  id: FestivalActivityReviewable["id"];

  @ApiProperty({
    required: true,
    oneOf: [
      { $ref: getSchemaPath(PublicReviewableGeneralResponseDto) },
      { $ref: getSchemaPath(PrivateReviewableGeneralResponseDto) },
    ],
  })
  general: FestivalActivityReviewable["general"];

  @ApiProperty({ required: true, type: InChargeResponseDto })
  inCharge: FestivalActivityReviewable["inCharge"];

  @ApiProperty({ required: true, type: SignaResponseDto })
  signa: FestivalActivityReviewable["signa"];

  @ApiProperty({ required: true, type: SecurityResponseDto })
  security: FestivalActivityReviewable["security"];

  @ApiProperty({ required: true, type: SupplyResponseDto })
  supply: FestivalActivityReviewable["supply"];

  @ApiProperty({ required: true, type: ReviewableInquiryResponseDto })
  inquiry: FestivalActivityReviewable["inquiry"];

  @ApiProperty({ required: true, isArray: true, type: FeedbackResponseDto })
  feedbacks: Feedback[];

  @ApiProperty({
    description: "Festival activity key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: KeyEvent[];

  @ApiProperty({
    description: "Festival activity tasks",
    isArray: true,
    type: FestivalTaskResponseDto,
  })
  tasks: FestivalActivityReviewable["tasks"];
}

export class RefusedFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements FestivalActivityRefused
{
  @ApiProperty({ required: true, example: REFUSED })
  status: typeof REFUSED;

  @ApiProperty({ required: true, type: ActivityRefusedReviewsResponseDto })
  reviews: RefusedReviews<"FA">;
}
export class InReviewFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements FestivalActivityInReview
{
  @ApiProperty({ required: true, example: IN_REVIEW })
  status: typeof IN_REVIEW;

  @ApiProperty({ required: true, type: ActivityInReviewReviewsResponseDto })
  reviews: InReviewReviews<"FA">;
}

export class ValidatedFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements FestivalActivityValidated
{
  @ApiProperty({ required: true, example: VALIDATED })
  status: typeof VALIDATED;

  @ApiProperty({ required: true, type: ActivityValidatedReviewsResponseDto })
  reviews: ValidatedReviews<"FA">;
}
