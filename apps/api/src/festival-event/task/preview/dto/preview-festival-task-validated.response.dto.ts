import { ApiProperty } from "@nestjs/swagger";
import { PreviewFestivalTaskValidated } from "@overbookd/festival-event";
import { VALIDATED } from "@overbookd/festival-event-constants";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";
import { ValidatedReviewsResponseDto } from "../../common/dto/reviewable/reviews.response.dto";

export class PreviewFestivalTaskValidatedResponseDto
  implements PreviewFestivalTaskValidated
{
  @ApiProperty({
    description: "The festival task id",
    type: Number,
  })
  id: PreviewFestivalTaskValidated["id"];

  @ApiProperty({
    description: "The festival task name",
    type: String,
  })
  name: PreviewFestivalTaskValidated["name"];

  @ApiProperty({
    description: "The festival task status",
    enum: [VALIDATED],
    example: VALIDATED,
  })
  status: typeof VALIDATED;

  @ApiProperty({
    description: "The festival task adherent in charge",
    type: AdherentResponseDto,
  })
  administrator: PreviewFestivalTaskValidated["administrator"];

  @ApiProperty({
    description: "The festival task team code",
    type: String,
    nullable: true,
  })
  team: PreviewFestivalTaskValidated["team"];

  @ApiProperty({
    description: "The festival task reviews",
    type: ValidatedReviewsResponseDto,
  })
  reviews: PreviewFestivalTaskValidated["reviews"];

  @ApiProperty({
    description: "The festival task main reviewer",
    type: AdherentResponseDto,
  })
  reviewer: PreviewFestivalTaskValidated["reviewer"];
}
