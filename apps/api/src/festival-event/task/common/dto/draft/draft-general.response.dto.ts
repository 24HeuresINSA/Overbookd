import { ApiProperty } from "@nestjs/swagger";
import { FestivalTaskDraft } from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../../../common/dto/adherent.response.dto";

type DraftGeneral = FestivalTaskDraft["general"];

export class DraftGeneralResponseDto implements DraftGeneral {
  @ApiProperty({
    description: "The festival task name",
    type: Number,
  })
  name: DraftGeneral["name"];

  @ApiProperty({
    description: "The festival task team",
    type: String,
    nullable: true,
  })
  team: DraftGeneral["team"];

  @ApiProperty({
    description: "The festival task administrator",
    type: AdherentResponseDto,
  })
  administrator: DraftGeneral["administrator"];
}
