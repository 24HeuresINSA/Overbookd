import {
  AssignmentSummary,
  AssignmentTeam,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { TaskIdentifierResponseDto } from "./task-identifier.response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AssignmentIdentifierResponseDto } from "../../common/dto/assignment-identifier.response.dto";
import { AssignmentTeamResponseDto } from "../../common/dto/assignment-team.response.dto";

class AssignmentSummaryResponseDto
  extends AssignmentIdentifierResponseDto
  implements AssignmentSummary
{
  @ApiProperty({ type: Date })
  start: AssignmentSummary["start"];

  @ApiProperty({ type: Date })
  end: AssignmentSummary["end"];

  @ApiProperty({ type: AssignmentTeamResponseDto, isArray: true })
  teams: AssignmentTeam[];
}

export class TaskWithAssignmentsSummaryResponseDto
  extends TaskIdentifierResponseDto
  implements TaskWithAssignmentsSummary
{
  @ApiProperty({ type: String, required: false })
  category: TaskWithAssignmentsSummary["category"];

  @ApiProperty({ type: AssignmentSummaryResponseDto, isArray: true })
  assignments: AssignmentSummary[];
}
