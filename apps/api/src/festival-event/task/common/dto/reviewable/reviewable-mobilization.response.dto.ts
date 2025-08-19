import { ApiProperty } from "@nestjs/swagger";
import {
  AtLeastOneTeam,
  AtLeastOneVolunteer,
  TeamMobilization,
  VolunteerWithConflicts,
  Assignment,
  Volunteer,
} from "@overbookd/festival-event";
import { VolunteerWithConflictsResponseDto } from "../volunteer-with-conflicts.response.dto";
import { TeamMobilizationResponseDto } from "../team-mobilization.response.dto";
import { WithAtLeastOneItem } from "@overbookd/list";
import { BaseMobilizationResponseDto } from "../base-mobilization.response.dto";
import { TimeWindowResponseDto } from "../../../../common/dto/time-window.response.dto";
import { VolunteerResponseDto } from "../../../../common/dto/volunteer.response.dto";

export class MobilizationWithAtLeastOneVolunteerDto
  extends BaseMobilizationResponseDto
  implements
    AtLeastOneVolunteer<{ withConflicts: true; withAssignments: false }>
{
  @ApiProperty({ type: TeamMobilizationResponseDto, isArray: true })
  teams: TeamMobilization[];

  @ApiProperty({ type: VolunteerWithConflictsResponseDto, isArray: true })
  volunteers: WithAtLeastOneItem<VolunteerWithConflicts>;
}

export class MobilizationWithAtLeastOneTeamDto
  extends BaseMobilizationResponseDto
  implements AtLeastOneTeam<{ withConflicts: true; withAssignments: false }>
{
  @ApiProperty({ type: VolunteerWithConflictsResponseDto, isArray: true })
  volunteers: VolunteerWithConflicts[];

  @ApiProperty({ type: TeamMobilizationResponseDto, isArray: true })
  teams: WithAtLeastOneItem<TeamMobilization>;
}

export class MobilizationAssignmentResponseDto
  extends TimeWindowResponseDto
  implements Assignment
{
  @ApiProperty({ type: VolunteerResponseDto, isArray: true })
  assignees: Volunteer[];
}

export class MobilizationWithAtLeastOneTeamAndAssignmentsDto
  extends MobilizationWithAtLeastOneTeamDto
  implements AtLeastOneTeam<{ withConflicts: true; withAssignments: true }>
{
  @ApiProperty({ type: MobilizationAssignmentResponseDto, isArray: true })
  assignments: Assignment[];
}

export class MobilizationWithAtLeastOneVolunteerAndAssignmentsDto
  extends MobilizationWithAtLeastOneVolunteerDto
  implements AtLeastOneVolunteer<{ withConflicts: true; withAssignments: true }>
{
  @ApiProperty({ type: MobilizationAssignmentResponseDto, isArray: true })
  assignments: Assignment[];
}
