import { Assignee, Assignment, TeamDemanded } from "@overbookd/assignment";
import { AssignmentIdentifierResponseDto } from "./assignment-identifier.response.dto";
import { ApiProperty } from "@nestjs/swagger";

class TeamDemandedDto implements TeamDemanded {
  @ApiProperty({ type: String })
  team: string;

  @ApiProperty({ type: Number })
  demand: number;
}

class AssigneeDto implements Assignee {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  as: string;
}

export class AssignmentResponseDto
  extends AssignmentIdentifierResponseDto
  implements Assignment
{
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: TeamDemandedDto, isArray: true })
  demands: TeamDemanded[];

  @ApiProperty({ type: AssigneeDto, isArray: true })
  assignees: Assignee[];
}
