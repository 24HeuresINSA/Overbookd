import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  PreviewDraft,
  PreviewInReview,
  ReviewStatus,
  DRAFT,
  IN_REVIEW,
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
} from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";

type Reviews = PreviewInReview["reviews"];

class ReviewsDto implements Reviews {
  @ApiProperty({
    description: "'humain' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW],
  })
  humain: ReviewStatus;

  @ApiProperty({
    description: "'signa' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW],
  })
  signa: ReviewStatus;

  @ApiProperty({
    description: "'secu' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW],
  })
  secu: ReviewStatus;

  @ApiProperty({
    description: "'matos' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW],
  })
  matos: ReviewStatus;

  @ApiProperty({
    description: "'elec' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW],
  })
  elec: ReviewStatus;

  @ApiProperty({
    description: "'barrieres' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW],
  })
  barrieres: ReviewStatus;

  @ApiProperty({
    description: "'commmunication' team review status",
    examples: [REVIEWING, NOT_ASKING_TO_REVIEW],
  })
  communication: ReviewStatus;
}

export class PreviewDraftFestivalActivityResponseDto implements PreviewDraft {
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

export class PreviewInReviewFestivalActivityResponseDto
  implements PreviewInReview
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
    type: ReviewsDto,
  })
  reviews: Reviews;
}
