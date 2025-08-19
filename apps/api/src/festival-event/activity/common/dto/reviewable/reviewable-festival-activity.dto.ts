import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  Feedback,
  InReview,
  InReviewReviews,
  FestivalActivityKeyEvent as KeyEvent,
  Refused,
  RefusedReviews,
  Reviewable,
  Validated,
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
  id: Reviewable["id"];

  @ApiProperty({
    required: true,
    oneOf: [
      { $ref: getSchemaPath(PublicReviewableGeneralResponseDto) },
      { $ref: getSchemaPath(PrivateReviewableGeneralResponseDto) },
    ],
  })
  general: Reviewable["general"];

  @ApiProperty({ required: true, type: InChargeResponseDto })
  inCharge: Reviewable["inCharge"];

  @ApiProperty({ required: true, type: SignaResponseDto })
  signa: Reviewable["signa"];

  @ApiProperty({ required: true, type: SecurityResponseDto })
  security: Reviewable["security"];

  @ApiProperty({ required: true, type: SupplyResponseDto })
  supply: Reviewable["supply"];

  @ApiProperty({ required: true, type: ReviewableInquiryResponseDto })
  inquiry: Reviewable["inquiry"];

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
  tasks: Reviewable["tasks"];
}

export class RefusedFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements Refused
{
  @ApiProperty({ required: true, example: REFUSED })
  status: typeof REFUSED;

  @ApiProperty({ required: true, type: ActivityRefusedReviewsResponseDto })
  reviews: RefusedReviews<"FA">;
}
export class InReviewFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements InReview
{
  @ApiProperty({ required: true, example: IN_REVIEW })
  status: typeof IN_REVIEW;

  @ApiProperty({ required: true, type: ActivityInReviewReviewsResponseDto })
  reviews: InReviewReviews<"FA">;
}

export class ValidatedFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements Validated
{
  @ApiProperty({ required: true, example: VALIDATED })
  status: typeof VALIDATED;

  @ApiProperty({ required: true, type: ActivityValidatedReviewsResponseDto })
  reviews: ValidatedReviews<"FA">;
}
