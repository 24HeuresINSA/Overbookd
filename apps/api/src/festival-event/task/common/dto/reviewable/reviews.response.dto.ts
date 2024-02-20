import { ApiProperty } from "@nestjs/swagger";
import {
  InReviewReviews,
  REVIEWING,
  ReviewingStatus,
} from "@overbookd/festival-event";

export class InReviewReviewsResponseDto implements InReviewReviews<"FT"> {
  @ApiProperty({
    required: true,
    enum: [REVIEWING],
    example: REVIEWING,
    description: "Humain reviewing status",
  })
  humain: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: [REVIEWING],
    example: REVIEWING,
    description: "Matos reviewing status",
  })
  matos: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: [REVIEWING],
    example: REVIEWING,
    description: "Elec reviewing status",
  })
  elec: ReviewingStatus;
}
