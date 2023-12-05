import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  PreviewDraft,
  PreviewReviewable,
  DRAFT,
  IN_REVIEW,
  InReviewReviews,
  ValidatedReviews,
  VALIDATED,
  REFUSED,
  RefusedReviews,
} from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";
import {
  InReviewReviewsResponseDto,
  RefusedReviewsResponseDto,
  ValidatedReviewsResponseDto,
} from "./reviews.response.dto";

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
type RefusedPreview = Extract<PreviewReviewable, { status: typeof REFUSED }>;

type ReviewablePreviewBase = Pick<
  PreviewReviewable,
  "id" | "adherent" | "name" | "team"
>;

class ReviewablePreviewBaseResponseDto implements ReviewablePreviewBase {
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
    description: "The festival activity adherent in charge",
    type: AdherentResponseDto,
  })
  adherent: Adherent;

  @ApiProperty({
    description: "The festival activity team code",
    type: String,
  })
  team: string;
}

export class InReviewPreviewFestivalActivityResponseDto
  extends ReviewablePreviewBaseResponseDto
  implements InReviewPreview
{
  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: IN_REVIEW,
  })
  status: typeof IN_REVIEW;

  @ApiProperty({ type: InReviewReviewsResponseDto })
  reviews: InReviewReviews;
}

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
  reviews: ValidatedReviews;
}

export class RefusedPreviewFestivalActivityResponseDto
  extends ReviewablePreviewBaseResponseDto
  implements RefusedPreview
{
  @ApiProperty({
    description: "The festival activity status",
    type: String,
    example: REFUSED,
  })
  status: typeof REFUSED;

  @ApiProperty({ type: RefusedReviewsResponseDto })
  reviews: RefusedReviews;
}
