import { ApiProperty } from "@nestjs/swagger";
import { FestivalTaskInReview as InReview } from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../../../common/dto/adherent.response.dto";

type General = InReview["general"];

export class ReviewableGeneralResponseDto implements General {
  @ApiProperty({
    description: "The festival task name",
    type: Number,
  })
  name: General["name"];

  @ApiProperty({
    description: "The festival task team",
    type: String,
  })
  team: General["team"];

  @ApiProperty({
    description: "The festival task administrator",
    type: AdherentResponseDto,
  })
  administrator: General["administrator"];
}
