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
  VALIDATED,
} from "@overbookd/festival-event-constants";

const validatedReviewStatus: ApprovalReviewStatus<"FA">[] = [
  NOT_ASKING_TO_REVIEW,
  APPROVED,
];
const inReviewReviewStatus: ReviewingStatus<"FA">[] = [
  ...validatedReviewStatus,
  REVIEWING,
];
const refusedReviewStatus: RejectionReviewStatus<"FA">[] = [
  ...inReviewReviewStatus,
  REJECTED,
];
export class ActivityInReviewReviewsResponseDto implements InReviewReviews<"FA"> {
  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Signa reviewing status",
  })
  signa: ReviewingStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Humain reviewing status",
  })
  humain: ReviewingStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Secu reviewing status",
  })
  secu: ReviewingStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Matos reviewing status",
  })
  matos: ReviewingStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Elec reviewing status",
  })
  elec: ReviewingStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Barrieres reviewing status",
  })
  barrieres: ReviewingStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Communication reviewing status",
  })
  communication: ReviewingStatus<"FA">;
}
export class ActivityValidatedReviewsResponseDto implements ValidatedReviews<"FA"> {
  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Signa reviewing status",
  })
  signa: ApprovalReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Humain reviewing status",
  })
  humain: ApprovalReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Secu reviewing status",
  })
  secu: ApprovalReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Matos reviewing status",
  })
  matos: ApprovalReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Elec reviewing status",
  })
  elec: ApprovalReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Barrieres reviewing status",
  })
  barrieres: ApprovalReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: NOT_ASKING_TO_REVIEW,
    description: "Communication reviewing status",
  })
  communication: ApprovalReviewStatus<"FA">;
}
export class ActivityRefusedReviewsResponseDto implements RefusedReviews<"FA"> {
  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Signa reviewing status",
  })
  signa: RejectionReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Humain reviewing status",
  })
  humain: RejectionReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Secu reviewing status",
  })
  secu: RejectionReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Matos reviewing status",
  })
  matos: RejectionReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Elec reviewing status",
  })
  elec: RejectionReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Barrieres reviewing status",
  })
  barrieres: RejectionReviewStatus<"FA">;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Communication reviewing status",
  })
  communication: RejectionReviewStatus<"FA">;
}
