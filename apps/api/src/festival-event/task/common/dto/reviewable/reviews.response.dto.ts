import { ApiProperty } from "@nestjs/swagger";
import {
  InReviewReviews,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
  RefusedReviews,
  RejectionReviewStatus,
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

const rejectedReviewStatuses = [...reviewStatuses, REJECTED];

export class RefusedReviewsResponseDto implements RefusedReviews<"FT"> {
  @ApiProperty({
    required: true,
    enum: rejectedReviewStatuses,
    example: REJECTED,
    description: "Humain reviewing status",
  })
  humain: RejectionReviewStatus;

  @ApiProperty({
    required: true,
    enum: rejectedReviewStatuses,
    example: REVIEWING,
    description: "Matos reviewing status",
  })
  matos: RejectionReviewStatus;

  @ApiProperty({
    required: true,
    enum: rejectedReviewStatuses,
    example: NOT_ASKING_TO_REVIEW,
    description: "Elec reviewing status",
  })
  elec: RejectionReviewStatus;
}
