import { ApiProperty } from "@nestjs/swagger";
import { PreviewReviewable, RefusedReviews } from "@overbookd/festival-event";
import { REFUSED } from "@overbookd/festival-event-constants";
import { RefusedReviewsResponseDto } from "../../review/dto/reviews.response.dto";
import { ReviewablePreviewBaseResponseDto } from "./base-preview.response.dto";

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
  reviews: RefusedReviews<"FA">;
}
