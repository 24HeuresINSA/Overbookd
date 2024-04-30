import { ApiProperty } from "@nestjs/swagger";
import { VolunteerForPlanning } from "@overbookd/http";

export class VolunteerForPlanningResponseDto implements VolunteerForPlanning {
  @ApiProperty({ type: String })
  firstname: string;

  @ApiProperty({ type: String })
  lastname: string;

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
