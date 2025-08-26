import { ApiProperty } from "@nestjs/swagger";
import { PreviewReviewable, InReviewReviews } from "@overbookd/festival-event";
import { IN_REVIEW } from "@overbookd/festival-event-constants";
import { ActivityInReviewReviewsResponseDto } from "../../review/dto/reviews.response.dto";
import { ReviewablePreviewBaseResponseDto } from "./base-preview.response.dto";

type InReviewPreview = Extract<PreviewReviewable, { status: typeof IN_REVIEW }>;

export class InReviewPreviewFestivalActivityResponseDto
  extends ReviewablePreviewBaseResponseDto
  implements InReviewPreview
{
  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: IN_REVIEW,
  })
  status: typeof IN_REVIEW;

  @ApiProperty({ type: ActivityInReviewReviewsResponseDto })
  reviews: InReviewReviews<"FA">;
}
