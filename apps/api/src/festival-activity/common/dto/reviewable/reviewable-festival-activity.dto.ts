import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  Feedback,
  IN_REVIEW,
  InReview,
  InReviewReviews,
  FestivalActivityKeyEvent as KeyEvent,
  REFUSED,
  Refused,
  RefusedReviews,
  Reviewable,
  VALIDATED,
  Validated,
  ValidatedReviews,
} from "@overbookd/festival-event";
import { FeedbackResponseDto } from "../feedback.response.dto";
import {
  InReviewReviewsResponseDto,
  RefusedReviewsResponseDto,
  ValidatedReviewsResponseDto,
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
}

export class RefusedFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements Refused
{
  @ApiProperty({ required: true, example: REFUSED })
  status: typeof REFUSED;

  @ApiProperty({ required: true, type: RefusedReviewsResponseDto })
  reviews: RefusedReviews<"FA">;
}
export class InReviewFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements InReview
{
  @ApiProperty({ required: true, example: IN_REVIEW })
  status: typeof IN_REVIEW;

  @ApiProperty({ required: true, type: InReviewReviewsResponseDto })
  reviews: InReviewReviews<"FA">;
}

export class ValidatedFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements Validated
{
  @ApiProperty({ required: true, example: VALIDATED })
  status: typeof VALIDATED;

  @ApiProperty({ required: true, type: ValidatedReviewsResponseDto })
  reviews: ValidatedReviews<"FA">;
}
