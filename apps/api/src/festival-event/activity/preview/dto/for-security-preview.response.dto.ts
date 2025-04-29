import { ApiProperty } from "@nestjs/swagger";
import { PreviewForSecurity } from "@overbookd/http";
import { TimeWindowResponseDto } from "../../../common/dto/time-window.response.dto";
import { BasePreviewForDashboardResponseDto } from "./base-preview-for-dashboard.response.dto";

export class PreviewForSecurityResponseDto
  extends BasePreviewForDashboardResponseDto
  implements PreviewForSecurity
{
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
