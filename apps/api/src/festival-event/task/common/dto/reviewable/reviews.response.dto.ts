import { ApiProperty } from "@nestjs/swagger";
import {
  InReviewReviews,
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  ReviewingStatus,
} from "@overbookd/festival-event";

const reviewStatuses = [NOT_ASKING_TO_REVIEW, REVIEWING];

export class InReviewReviewsResponseDto implements InReviewReviews<"FT"> {
  @ApiProperty({
    required: true,
    enum: reviewStatuses,
    example: REVIEWING,
    description: "Humain reviewing status",
  })
  humain: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: reviewStatuses,
    example: REVIEWING,
    description: "Matos reviewing status",
  })
  matos: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: reviewStatuses,
    example: REVIEWING,
    description: "Elec reviewing status",
  })
  elec: ReviewingStatus;
}
