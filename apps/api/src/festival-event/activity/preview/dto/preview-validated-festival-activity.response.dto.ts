import { ApiProperty } from "@nestjs/swagger";
import { PreviewReviewable, ValidatedReviews } from "@overbookd/festival-event";
import { VALIDATED } from "@overbookd/status";
import { ValidatedReviewsResponseDto } from "../../review/dto/reviews.response.dto";
import { ReviewablePreviewBaseResponseDto } from "./base-preview-festival-activity.response.dto";

type ValidatedPreview = Extract<
  PreviewReviewable,
  { status: typeof VALIDATED }
>;

export class ValidatedPreviewFestivalActivityResponseDto
  extends ReviewablePreviewBaseResponseDto
  implements ValidatedPreview
{
  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: VALIDATED,
  })
  status: typeof VALIDATED;

  @ApiProperty({ type: ValidatedReviewsResponseDto })
  reviews: ValidatedReviews<"FA">;
}
