import { ApiProperty } from "@nestjs/swagger";
import { IProvidePeriod } from "@overbookd/time";
import {
  MultiPlanningVolunteer,
  MultiPlanningVolunteerAssignment,
} from "@overbookd/http";
import { PeriodResponseDto } from "../../common/dto/period.response.dto";

class MultiPlanningVolunteerAssignmentDto
  extends PeriodResponseDto
  implements MultiPlanningVolunteerAssignment
{
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;
}

export class MultiPlanningVolunteerResponseDto implements MultiPlanningVolunteer {
  @ApiProperty({ name: "id", description: "Volunteer id", type: Number })
  id: number;

  @ApiProperty({ description: "Volunteer firstname", type: String })
  firstname: string;

  @ApiProperty({ description: "Volunteer lastname", type: String })
  lastname: string;

  @ApiProperty({
    description: "Teams volunteer is member of",
    type: String,
    isArray: true,
  })
  teams: string[];

  @ApiProperty({
    description: "Volunteer availabilities",
    type: PeriodResponseDto,
    isArray: true,
  })
  availabilities: IProvidePeriod[];

  @ApiProperty({
    description: "Volunteer tasks",
    type: MultiPlanningVolunteerAssignmentDto,
    isArray: true,
  })
  assignments: MultiPlanningVolunteerAssignment[];
}
