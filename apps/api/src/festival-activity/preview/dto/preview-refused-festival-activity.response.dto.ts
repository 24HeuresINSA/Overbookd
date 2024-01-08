import { ApiProperty } from "@nestjs/swagger";
import {
  PreviewReviewable,
  REFUSED,
  RefusedReviews,
} from "@overbookd/festival-activity";
import { RefusedReviewsResponseDto } from "../../review/dto/reviews.response.dto";
import { ReviewablePreviewBaseResponseDto } from "./base-preview-festival-activity.response.dto";

type RefusedPreview = Extract<PreviewReviewable, { status: typeof REFUSED }>;

export class RefusedPreviewFestivalActivityResponseDto
  extends ReviewablePreviewBaseResponseDto
  implements RefusedPreview
{
  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: REFUSED,
  })
  status: typeof REFUSED;

  @ApiProperty({ type: RefusedReviewsResponseDto })
  reviews: RefusedReviews;
}
