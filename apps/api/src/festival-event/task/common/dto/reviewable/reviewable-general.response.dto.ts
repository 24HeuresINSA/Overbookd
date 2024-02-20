import { ApiProperty } from "@nestjs/swagger";
import { InReviewWithConflicts } from "@overbookd/http";
import { AdherentResponseDto } from "../../../../common/dto/adherent.response.dto";

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
