import {
  AssignmentTeam,
  TaskCategorizedForPlanning,
} from "@overbookd/assignment";
import { Category, Status } from "@overbookd/festival-event-constants";
import { AssignmentSummaryWithTask } from "@overbookd/http";
import { AssignmentIdentifierResponseDto } from "../../common/dto/assignment-identifier.response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AssignmentTeamResponseDto } from "../../common/dto/assignment-team.response.dto";

class TaskCategorizedForPlanningDto implements TaskCategorizedForPlanning {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Boolean })
  topPriority: boolean;

  @ApiProperty({ type: String, required: false })
  category?: Category;

  @ApiProperty({ type: String })
  inChargeTeam: string;

  @ApiProperty({ type: String })
  status: Status;

  @ApiProperty({ type: Boolean })
  hasFriendsAssigned: boolean;
}

export class AssignmentSummaryWithTaskResponseDto
  extends AssignmentIdentifierResponseDto
  implements AssignmentSummaryWithTask
{
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: AssignmentTeamResponseDto, isArray: true })
  teams: AssignmentTeam[];

  @ApiProperty({ type: TaskCategorizedForPlanningDto })
  task: TaskCategorizedForPlanning;
}
