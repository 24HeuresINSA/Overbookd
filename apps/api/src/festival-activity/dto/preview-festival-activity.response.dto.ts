import { ApiProperty } from "@nestjs/swagger";
import type {
  Adherent,
  PreviewFestivalActivity,
  REVIEWING,
} from "@overbookd/festival-activity";
import { DRAFT } from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";

type Reviews = PreviewFestivalActivity["reviews"];

class ReviewsDto implements Reviews {
  @ApiProperty({
    description:
      "'humain' team review status (undefined means no need for review)",
  })
  humain: undefined | typeof REVIEWING;

  @ApiProperty({
    description:
      "'signa' team review status (undefined means no need for review)",
  })
  signa: undefined | typeof REVIEWING;

  @ApiProperty({
    description:
      "'secu' team review status (undefined means no need for review)",
  })
  secu: undefined | typeof REVIEWING;

  @ApiProperty({
    description:
      "'matos' team review status (undefined means no need for review)",
  })
  matos: undefined | typeof REVIEWING;

  @ApiProperty({
    description:
      "'elec' team review status (undefined means no need for review)",
  })
  elec: undefined | typeof REVIEWING;

  @ApiProperty({
    description:
      "'barrieres' team review status (undefined means no need for review)",
  })
  barrieres: undefined | typeof REVIEWING;

  @ApiProperty({
    description:
      "'comcom' team review status (undefined means no need for review)",
  })
  comcom: undefined | typeof REVIEWING;
}

export class PreviewFestivalActivityResponseDto
  implements PreviewFestivalActivity
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

  @ApiProperty({
    type: ReviewsDto,
  })
  reviews: Reviews;
}
