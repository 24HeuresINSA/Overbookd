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
  code: string;

  @ApiProperty({ type: Number })
  demands: number;

  @ApiProperty({ type: Number })
  assigned: number;
}

class AssignmentIdentifierDto implements AssignmentIdentifier {
  @ApiProperty({ type: String })
  assignmentId: string;

  @ApiProperty({ type: String })
  mobilizationId: string;
}

class AssignmentSummaryDto implements AssignmentSummary {
  @ApiProperty({ type: AssignmentIdentifierDto })
  identifier: AssignmentIdentifier;

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
  @ApiProperty({ type: AssignmentSummaryDto, isArray: true })
  assignments: AssignmentSummary[];
}
