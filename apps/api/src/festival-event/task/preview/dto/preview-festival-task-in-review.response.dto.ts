import { ApiProperty } from "@nestjs/swagger";
import {
  IN_REVIEW,
  PreviewFestivalTaskInReview,
} from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";
import { InReviewReviewsResponseDto } from "../../common/dto/reviewable/reviews.response.dto";

export class PreviewFestivalTaskInReviewResponseDto
  implements PreviewFestivalTaskInReview
{
  @ApiProperty({
    description: "The festival task id",
    type: Number,
  })
  id: PreviewFestivalTaskInReview["id"];

  @ApiProperty({
    description: "The festival task name",
    type: String,
  })
  name: PreviewFestivalTaskInReview["name"];

  @ApiProperty({
    description: "The festival task status",
    enum: [IN_REVIEW],
    example: IN_REVIEW,
  })
  status: typeof IN_REVIEW;

  @ApiProperty({
    description: "The festival task adherent in charge",
    type: AdherentResponseDto,
  })
  administrator: PreviewFestivalTaskInReview["administrator"];

  @ApiProperty({
    description: "The festival task team code",
    type: String,
    nullable: true,
  })
  team: PreviewFestivalTaskInReview["team"];

  @ApiProperty({
    description: "The festival task reviews",
    type: InReviewReviewsResponseDto,
  })
  reviews: PreviewFestivalTaskInReview["reviews"];

  @ApiProperty({
    description: "The festival task main reviewer",
    type: AdherentResponseDto,
  })
  reviewer: PreviewFestivalTaskInReview["reviewer"];
}
