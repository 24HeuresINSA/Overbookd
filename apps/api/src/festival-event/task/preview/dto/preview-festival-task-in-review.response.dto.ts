import { ApiProperty } from "@nestjs/swagger";
import { PreviewFestivalTaskInReview } from "@overbookd/festival-event";
import { IN_REVIEW } from "@overbookd/festival-event-constants";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";
import { TaskInReviewReviewsResponseDto } from "../../common/dto/reviewable/reviews.response.dto";

export class PreviewFestivalTaskInReviewResponseDto implements PreviewFestivalTaskInReview {
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
    type: TaskInReviewReviewsResponseDto,
  })
  reviews: PreviewFestivalTaskInReview["reviews"];

  @ApiProperty({
    description: "The festival task main reviewer",
    type: AdherentResponseDto,
  })
  reviewer: PreviewFestivalTaskInReview["reviewer"];
}
