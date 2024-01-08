import { ApiProperty } from "@nestjs/swagger";
import { PreviewForSecurity } from "@overbookd/http";
import { TimeWindowResponseDto } from "../../common/dto/time-window.response.dto";

export class PreviewForSecurityResponseDto implements PreviewForSecurity {
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: PreviewForSecurity["id"];

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: PreviewForSecurity["name"];

  @ApiProperty({
    description: "Team in charge of this festival activity",
    type: String,
  })
  team: PreviewForSecurity["team"];

  @ApiProperty({
    description: "The festival activity time windows",
    type: TimeWindowResponseDto,
    isArray: true,
  })
  timeWindows: PreviewForSecurity["timeWindows"];

  @ApiProperty({
    description: "Festival activity security special needs",
    type: String,
  })
  specialNeeds: PreviewForSecurity["specialNeeds"];

  @ApiProperty({
    description: "Free pass count",
    type: Number,
  })
  freePass: PreviewForSecurity["freePass"];
}
