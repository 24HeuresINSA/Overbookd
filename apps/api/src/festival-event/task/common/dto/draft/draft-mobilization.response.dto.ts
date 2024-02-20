import { ApiProperty } from "@nestjs/swagger";
import {
  Mobilization,
  TeamMobilization,
  VolunteerWithConflicts,
} from "@overbookd/festival-event";
import { VolunteerWithConflictsResponseDto } from "../volunteer-with-conflicts.response.dto";
import { TeamMobilizationResponseDto } from "../team-mobilization.response.dto";
import { BaseMobilizationResponseDto } from "../base-mobilization.response.dto";

export class DraftMobilizationResponseDto
  extends BaseMobilizationResponseDto
  implements Mobilization
{
  @ApiProperty({ type: VolunteerWithConflictsResponseDto, isArray: true })
  volunteers: VolunteerWithConflicts[];

  @ApiProperty({ type: TeamMobilizationResponseDto, isArray: true })
  teams: TeamMobilization[];
}
