import { ApiProperty } from "@nestjs/swagger";
import {
  APPROVED,
  ApprovalReviewStatus,
  InReviewReviews,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
  RefusedReviews,
  RejectionReviewStatus,
  ReviewingStatus,
  VALIDATED,
  ValidatedReviews,
} from "@overbookd/festival-event";

const validatedReviewStatus: ApprovalReviewStatus[] = [
  NOT_ASKING_TO_REVIEW,
  APPROVED,
];
const inReviewReviewStatus: ReviewingStatus[] = [
  ...validatedReviewStatus,
  REVIEWING,
];
const refusedReviewStatus: RejectionReviewStatus[] = [
  ...inReviewReviewStatus,
  REJECTED,
];
export class InReviewReviewsResponseDto implements InReviewReviews<"FA"> {
  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Signa reviewing status",
  })
  signa: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Humain reviewing status",
  })
  humain: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Secu reviewing status",
  })
  secu: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Matos reviewing status",
  })
  matos: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Elec reviewing status",
  })
  elec: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Barrieres reviewing status",
  })
  barrieres: ReviewingStatus;

  @ApiProperty({
    required: true,
    enum: inReviewReviewStatus,
    example: REVIEWING,
    description: "Communication reviewing status",
  })
  communication: ReviewingStatus;
}
export class ValidatedReviewsResponseDto implements ValidatedReviews<"FA"> {
  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Signa reviewing status",
  })
  signa: ApprovalReviewStatus;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Humain reviewing status",
  })
  humain: ApprovalReviewStatus;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Secu reviewing status",
  })
  secu: ApprovalReviewStatus;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Matos reviewing status",
  })
  matos: ApprovalReviewStatus;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Elec reviewing status",
  })
  elec: ApprovalReviewStatus;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: VALIDATED,
    description: "Barrieres reviewing status",
  })
  barrieres: ApprovalReviewStatus;

  @ApiProperty({
    required: true,
    enum: validatedReviewStatus,
    example: NOT_ASKING_TO_REVIEW,
    description: "Communication reviewing status",
  })
  communication: ApprovalReviewStatus;
}
export class RefusedReviewsResponseDto implements RefusedReviews<"FA"> {
  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Signa reviewing status",
  })
  signa: RejectionReviewStatus;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Humain reviewing status",
  })
  humain: RejectionReviewStatus;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Secu reviewing status",
  })
  secu: RejectionReviewStatus;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Matos reviewing status",
  })
  matos: RejectionReviewStatus;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Elec reviewing status",
  })
  elec: RejectionReviewStatus;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Barrieres reviewing status",
  })
  barrieres: RejectionReviewStatus;

  @ApiProperty({
    required: true,
    enum: refusedReviewStatus,
    example: REJECTED,
    description: "Communication reviewing status",
  })
  communication: RejectionReviewStatus;
}
