import { ApiProperty } from "@nestjs/swagger";
import { AdherentResponseDto } from "../adherent.response.dto";
import { InReviewWithConflicts } from "@overbookd/http";

type General = InReviewWithConflicts["general"];

export class InReviewGeneralResponseDto implements General {
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
