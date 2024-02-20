import { ApiProperty } from "@nestjs/swagger";
import {
  AtLeastOneTeam,
  AtLeastOneVolunteer,
  TeamMobilization,
  VolunteerWithConflicts,
} from "@overbookd/festival-event";
import { VolunteerWithConflictsResponseDto } from "../volunteer-with-conflicts.response.dto";
import { TeamMobilizationResponseDto } from "../team-mobilization.response.dto";
import { WithAtLeastOneItem } from "@overbookd/list";
import { BaseMobilizationResponseDto } from "../base-mobilization.response.dto";

export class MobilizationWithAtLeastOneVolunteerDto
  extends BaseMobilizationResponseDto
  implements AtLeastOneVolunteer<{ withConflicts: true }>
{
  @ApiProperty({ type: TeamMobilizationResponseDto, isArray: true })
  teams: TeamMobilization[];

  @ApiProperty({ type: VolunteerWithConflictsResponseDto, isArray: true })
  volunteers: WithAtLeastOneItem<VolunteerWithConflicts>;
}

export class MobilizationWithAtLeastOneTeamDto
  extends BaseMobilizationResponseDto
  implements AtLeastOneTeam<{ withConflicts: true }>
{
  @ApiProperty({ type: VolunteerWithConflictsResponseDto, isArray: true })
  volunteers: VolunteerWithConflicts[];

  @ApiProperty({ type: TeamMobilizationResponseDto, isArray: true })
  teams: WithAtLeastOneItem<TeamMobilization>;
}
