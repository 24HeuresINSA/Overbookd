import { ApiProperty } from "@nestjs/swagger";
import {
  ApprovalReviewStatus,
  InReviewReviews,
  RefusedReviews,
  RejectionReviewStatus,
  ReviewingStatus,
  ValidatedReviews,
} from "@overbookd/festival-event";
import {
  APPROVED,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
} from "@overbookd/festival-event-constants";

const reviewStatuses = [NOT_ASKING_TO_REVIEW, REVIEWING];

export class InReviewReviewsResponseDto implements InReviewReviews<"FT"> {
  @ApiProperty({
    required: true,
    enum: reviewStatuses,
    example: REVIEWING,
    description: "Humain reviewing status",
  })
  humain: ReviewingStatus<"FT">;

  @ApiProperty({
    required: true,
    enum: reviewStatuses,
    example: REVIEWING,
    description: "Matos reviewing status",
  })
  matos: ReviewingStatus<"FT">;

  @ApiProperty({
    required: true,
    enum: reviewStatuses,
    example: REVIEWING,
    description: "Elec reviewing status",
  })
  elec: ReviewingStatus<"FT">;
}

const rejectedReviewStatuses = [...reviewStatuses, REJECTED];

export class RefusedReviewsResponseDto implements RefusedReviews<"FT"> {
  @ApiProperty({
    required: true,
    enum: rejectedReviewStatuses,
    example: REJECTED,
    description: "Humain reviewing status",
  })
  humain: RejectionReviewStatus<"FT">;

  @ApiProperty({
    required: true,
    enum: rejectedReviewStatuses,
    example: REVIEWING,
    description: "Matos reviewing status",
  })
  matos: RejectionReviewStatus<"FT">;

  @ApiProperty({
    required: true,
    enum: rejectedReviewStatuses,
    example: NOT_ASKING_TO_REVIEW,
    description: "Elec reviewing status",
  })
  elec: RejectionReviewStatus<"FT">;
}

export class ValidatedReviewsResponseDto implements ValidatedReviews<"FT"> {
  @ApiProperty({
    required: true,
    enum: [APPROVED],
    example: APPROVED,
    description: "Humain reviewing status",
  })
  humain: ApprovalReviewStatus<"FT">;

  @ApiProperty({
    required: true,
    enum: [APPROVED],
    example: APPROVED,
    description: "Matos reviewing status",
  })
  matos: ApprovalReviewStatus<"FT">;

  @ApiProperty({
    required: true,
    enum: [APPROVED, NOT_ASKING_TO_REVIEW],
    example: NOT_ASKING_TO_REVIEW,
    description: "Elec reviewing status",
  })
  elec: ApprovalReviewStatus<"FT">;
}
