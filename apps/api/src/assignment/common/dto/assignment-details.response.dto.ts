import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  TeamMemberForDetails,
  Assignment,
  BaseAssigneeForDetails,
  TeamDemanded,
} from "@overbookd/assignment";
import { AssignmentIdentifierResponseDto } from "./assignment-identifier.response.dto";
import { TeamDemandedResponseDto } from "./team-demanded.response.dto";

class BaseAssigneeForDetailsDto implements BaseAssigneeForDetails {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  firstname: string;

  @ApiProperty({ type: String })
  lastname: string;
}

class TeamMemberForDetailsDto
  extends BaseAssigneeForDetailsDto
  implements TeamMemberForDetails
{
  @ApiProperty({ type: String, isArray: true })
  teams: string[];

  @ApiProperty({ type: String })
  as: string;

  @ApiProperty({ type: BaseAssigneeForDetailsDto, isArray: true })
  friends: BaseAssigneeForDetails[];

  @ApiProperty({ type: String, required: false })
  comment?: string;

  @ApiProperty({ type: String, required: false })
  note?: string;
}

export class AssignmentWithDetailsResponseDto
  extends AssignmentIdentifierResponseDto
  implements Assignment<{ withDetails: true }>
{
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  appointment: string;

  @ApiProperty({ type: TeamDemandedResponseDto, isArray: true })
  demands: TeamDemanded[];

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(BaseAssigneeForDetailsDto) },
      { $ref: getSchemaPath(TeamMemberForDetailsDto) },
    ],
    isArray: true,
  })
  assignees: Assignment<{ withDetails: true }>["assignees"];
}
