import { ApiProperty } from "@nestjs/swagger";
import {
  PreviewReviewable, IN_REVIEW,
  InReviewReviews
} from "@overbookd/festival-activity";
import { InReviewReviewsResponseDto } from "../../dto/reviews.response.dto";
import { ReviewablePreviewBaseResponseDto } from "./base-preview-festival-activity.response.dto";

type InReviewPreview = Extract<PreviewReviewable, { status: typeof IN_REVIEW; }>;

export class InReviewPreviewFestivalActivityResponseDto
  extends ReviewablePreviewBaseResponseDto
  implements InReviewPreview {
  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: IN_REVIEW,
  })
  status: typeof IN_REVIEW;

  @ApiProperty({ type: InReviewReviewsResponseDto })
  reviews: InReviewReviews;
}
