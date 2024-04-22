import { Assignee, Assignment, TeamDemanded } from "@overbookd/assignment";
import { AssignmentIdentifierResponseDto } from "./assignment-identifier.response.dto";
import { ApiProperty, getSchemaPath } from "@nestjs/swagger";

class TeamDemandedDto implements TeamDemanded {
  @ApiProperty({ type: String })
  team: string;

  @ApiProperty({ type: Number })
  demand: number;
}

type TeamMember = Extract<Assignee, { as: string }>;
type NamelyDemanded = Exclude<Assignee, { as: string }>;

export class TeamMemberDto implements TeamMember {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  as: string;
}

export class NamelyDemandedDto implements NamelyDemanded {
  @ApiProperty({ type: Number })
  id: number;
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

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(TeamMemberDto) },
      { $ref: getSchemaPath(NamelyDemandedDto) },
    ],
    isArray: true,
  })
  assignees: Assignee[];
}
