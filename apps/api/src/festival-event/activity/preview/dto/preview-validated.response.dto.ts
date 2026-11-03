import { ApiProperty } from "@nestjs/swagger";
import {
  PreviewFestivalActivityReviewable,
  ValidatedReviews,
} from "@overbookd/festival-event";
import { VALIDATED } from "@overbookd/festival-event-constants";
import { ActivityValidatedReviewsResponseDto } from "../../review/dto/reviews.response.dto";
import { ReviewablePreviewBaseResponseDto } from "./base-preview.response.dto";

type ValidatedPreview = Extract<
  PreviewFestivalActivityReviewable,
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

  @ApiProperty({ type: ActivityValidatedReviewsResponseDto })
  reviews: ValidatedReviews<"FA">;
}
