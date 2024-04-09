import { ApiProperty } from "@nestjs/swagger";
import { PreviewFestivalTaskRefused } from "@overbookd/festival-event";
import { REFUSED } from "@overbookd/festival-event-constants";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";
import { RefusedReviewsResponseDto } from "../../common/dto/reviewable/reviews.response.dto";

export class PreviewFestivalTaskRefusedResponseDto
  implements PreviewFestivalTaskRefused
{
  @ApiProperty({
    description: "The festival task id",
    type: Number,
  })
  id: PreviewFestivalTaskRefused["id"];

  @ApiProperty({
    description: "The festival task name",
    type: String,
  })
  name: PreviewFestivalTaskRefused["name"];

  @ApiProperty({
    description: "The festival task status",
    enum: [REFUSED],
    example: REFUSED,
  })
  status: typeof REFUSED;

  @ApiProperty({
    description: "The festival task adherent in charge",
    type: AdherentResponseDto,
  })
  administrator: PreviewFestivalTaskRefused["administrator"];

  @ApiProperty({
    description: "The festival task team code",
    type: String,
    nullable: true,
  })
  team: PreviewFestivalTaskRefused["team"];

  @ApiProperty({
    description: "The festival task reviews",
    type: RefusedReviewsResponseDto,
  })
  reviews: PreviewFestivalTaskRefused["reviews"];

  @ApiProperty({
    description: "The festival task main reviewer",
    type: AdherentResponseDto,
  })
  reviewer: PreviewFestivalTaskRefused["reviewer"];
}
