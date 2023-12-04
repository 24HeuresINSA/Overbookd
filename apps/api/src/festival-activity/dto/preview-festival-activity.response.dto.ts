import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  PreviewDraft,
  PreviewReviewable,
  ReviewStatus,
  DRAFT,
  IN_REVIEW,
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  APPROVED,
  InReviewReviews,
  ValidatedReviews,
  ApprovalReviewStatus,
  VALIDATED,
} from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";

class ValidatedReviewsDto implements ValidatedReviews {
  @ApiProperty({
    description: "'humain' team review status",
    examples: [NOT_ASKING_TO_REVIEW, APPROVED],
  })
  humain: ApprovalReviewStatus;

  @ApiProperty({
    description: "'signa' team review status",
    examples: [NOT_ASKING_TO_REVIEW, APPROVED],
  })
  signa: ApprovalReviewStatus;

  @ApiProperty({
    description: "'secu' team review status",
    examples: [NOT_ASKING_TO_REVIEW, APPROVED],
  })
  secu: ApprovalReviewStatus;

  @ApiProperty({
    description: "'matos' team review status",
    examples: [NOT_ASKING_TO_REVIEW, APPROVED],
  })
  matos: ApprovalReviewStatus;

  @ApiProperty({
    description: "'elec' team review status",
    examples: [NOT_ASKING_TO_REVIEW, APPROVED],
  })
  elec: ApprovalReviewStatus;

  @ApiProperty({
    description: "'barrieres' team review status",
    examples: [NOT_ASKING_TO_REVIEW, APPROVED],
  })
  barrieres: ApprovalReviewStatus;

  @ApiProperty({
    description: "'commmunication' team review status",
    examples: [NOT_ASKING_TO_REVIEW, APPROVED],
  })
  communication: ApprovalReviewStatus;
}

class InReviewReviewsDto implements InReviewReviews {
  @ApiProperty({
    description: "'humain' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW, APPROVED],
  })
  humain: ReviewStatus;

  @ApiProperty({
    description: "'signa' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW, APPROVED],
  })
  signa: ReviewStatus;

  @ApiProperty({
    description: "'secu' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW, APPROVED],
  })
  secu: ReviewStatus;

  @ApiProperty({
    description: "'matos' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW, APPROVED],
  })
  matos: ReviewStatus;

  @ApiProperty({
    description: "'elec' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW, APPROVED],
  })
  elec: ReviewStatus;

  @ApiProperty({
    description: "'barrieres' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW, APPROVED],
  })
  barrieres: ReviewStatus;

  @ApiProperty({
    description: "'commmunication' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW, APPROVED],
  })
  communication: ReviewStatus;
}

export class DraftPreviewFestivalActivityResponseDto implements PreviewDraft {
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: DRAFT,
  })
  status: typeof DRAFT;

  @ApiProperty({
    description: "The festival activity adherent in charge",
    type: AdherentResponseDto,
  })
  adherent: Adherent;

  @ApiProperty({
    description: "The festival activity team code",
    type: String,
  })
  team: string | null;
}

type InReviewPreview = Extract<PreviewReviewable, { status: typeof IN_REVIEW }>;
type ValidatedPreview = Extract<
  PreviewReviewable,
  { status: typeof VALIDATED }
>;

export class InReviewPreviewFestivalActivityResponseDto
  implements InReviewPreview
{
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: IN_REVIEW,
  })
  status: typeof IN_REVIEW;

  @ApiProperty({
    description: "The festival activity adherent in charge",
    type: AdherentResponseDto,
  })
  adherent: Adherent;

  @ApiProperty({
    description: "The festival activity team code",
    type: String,
  })
  team: string;

  @ApiProperty({
    type: InReviewReviewsDto,
  })
  reviews: InReviewReviews;
}

export class ValidatedPreviewFestivalActivityResponseDto
  implements ValidatedPreview
{
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: VALIDATED,
  })
  status: typeof VALIDATED;

  @ApiProperty({
    description: "The festival activity adherent in charge",
    type: AdherentResponseDto,
  })
  adherent: Adherent;

  @ApiProperty({
    description: "The festival activity team code",
    type: String,
  })
  team: string;

  @ApiProperty({
    type: ValidatedReviewsDto,
  })
  reviews: ValidatedReviews;
}
