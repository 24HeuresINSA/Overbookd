import {
  AssignmentSummary,
  AssignmentTeam,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { TaskIdentifierResponseDto } from "./task-identifier.response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AssignmentIdentifier } from "@overbookd/assignment/src/assign-task-to-volunteer/assignment";

class AssignmentTeamDto implements AssignmentTeam {
  @ApiProperty({ type: String })
  team: string;

  @ApiProperty({ type: Number })
  demand: number;

  @ApiProperty({ type: Number })
  assigned: number;
}

class AssignmentIdentifierDto implements AssignmentIdentifier {
  @ApiProperty({ type: String })
  assignmentId: string;

  @ApiProperty({ type: String })
  mobilizationId: string;

  @ApiProperty({ type: Number })
  taskId: number;
}

class AssignmentSummaryDto
  extends AssignmentIdentifierDto
  implements AssignmentSummary
{
  @ApiProperty({ type: Date })
  start: AssignmentSummary["start"];

  @ApiProperty({ type: Date })
  end: AssignmentSummary["end"];

  @ApiProperty({ type: AssignmentTeamDto, isArray: true })
  teams: AssignmentTeam[];
}

export class TaskWithAssignmentsSummaryResponseDto
  extends TaskIdentifierResponseDto
  implements TaskWithAssignmentsSummary
{
  @ApiProperty({ type: String, required: false })
  category: TaskWithAssignmentsSummary["category"];

  @ApiProperty({ type: AssignmentSummaryDto, isArray: true })
  assignments: AssignmentSummary[];
}
