import { ApiProperty } from "@nestjs/swagger";
import { VolunteerForPlanningLeaflet } from "@overbookd/http";

export class VolunteerForPlanningLeafletResponseDto implements VolunteerForPlanningLeaflet {
  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: String, required: false })
  nickname?: string;

  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({
    type: Number,
    description: "Total assignment duration in milliseconds",
  })
  assignment: number;

  @ApiProperty({ type: String, isArray: true })
  teams: string[];
}
