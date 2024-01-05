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
import { PreviewForCommunication, PreviewForSecu } from "@overbookd/http";
import { TimeWindowResponseDto } from "./time-window.response.dto";

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

export class PreviewForSecuResponseDto implements PreviewForSecu {
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: PreviewForSecu["id"];

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: PreviewForSecu["name"];

  @ApiProperty({
    description: "Team in charge of this festival activity",
    type: String,
  })
  team: PreviewForSecu["team"];

  @ApiProperty({
    description: "The festival activity time windows",
    type: TimeWindowResponseDto,
    isArray: true,
  })
  timeWindows: PreviewForSecu["timeWindows"];

  @ApiProperty({
    description: "Festival activity security special needs",
    type: String,
  })
  specialNeeds: PreviewForSecu["specialNeeds"];

  @ApiProperty({
    description: "Free pass count",
    type: Number,
  })
  freePass: PreviewForSecu["freePass"];
}

const statuses = [DRAFT, IN_REVIEW, VALIDATED, REFUSED];

export class PreviewForCommunicationResponseDto
  implements PreviewForCommunication
{
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: PreviewForCommunication["id"];

  @ApiProperty({
    description: "The festival activity status",
    enum: statuses,
  })
  status: PreviewForCommunication["status"];

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: PreviewForCommunication["name"];

  @ApiProperty({
    description: "The festival activity time windows",
    type: TimeWindowResponseDto,
    isArray: true,
  })
  timeWindows: PreviewForCommunication["timeWindows"];

  @ApiProperty({
    description: "The festival activity description",
    type: String,
  })
  description: PreviewForCommunication["description"];

  @ApiProperty({
    description: "The festival activity photo link",
    type: String,
  })
  photoLink: PreviewForCommunication["photoLink"];

  @ApiProperty({
    description: "The festival activity is flagship",
    type: Boolean,
  })
  isFlagship: PreviewForCommunication["isFlagship"];

  @ApiProperty({
    description: "The festival activity categories",
    type: String,
    isArray: true,
  })
  categories: PreviewForCommunication["categories"];
}
