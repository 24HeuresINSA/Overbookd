import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  AssigneeForDetailsAs,
  Assignment,
  SimpleAssigneeForDetails,
  TeamDemanded,
} from "@overbookd/assignment";
import { AssignmentIdentifierResponseDto } from "./assignment-identifier.response.dto";
import { TeamDemandedResponseDto } from "./team-demanded.response.dto";

class SimpleAssigneeForDetailsDto implements SimpleAssigneeForDetails {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  firstname: string;

  @ApiProperty({ type: String })
  lastname: string;
}

class AssigneeForDetailsAsDto
  extends SimpleAssigneeForDetailsDto
  implements AssigneeForDetailsAs
{
  @ApiProperty({ type: String, isArray: true })
  teams: string[];

  @ApiProperty({ type: String })
  as: string;

  @ApiProperty({ type: SimpleAssigneeForDetailsDto, isArray: true })
  friends: SimpleAssigneeForDetails[];
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
      { $ref: getSchemaPath(SimpleAssigneeForDetailsDto) },
      { $ref: getSchemaPath(AssigneeForDetailsAsDto) },
    ],
    isArray: true,
  })
  assignees: Assignment<{ withDetails: true }>["assignees"];
}
