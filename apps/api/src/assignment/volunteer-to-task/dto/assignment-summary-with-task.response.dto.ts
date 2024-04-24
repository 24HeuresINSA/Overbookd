import { AssignmentTeam } from "@overbookd/assignment";
import { Category } from "@overbookd/festival-event-constants";
import { AssignmentSummaryWithTask } from "@overbookd/http";
import { AssignmentIdentifierResponseDto } from "../../common/dto/assignment-identifier.response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AssignmentTeamResponseDto } from "../../common/dto/assignment-team.response.dto";

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

  @ApiProperty({ type: String, required: false })
  name: string;

  @ApiProperty({ type: Boolean })
  topPriority: boolean;

  @ApiProperty({ type: String, required: false })
  category?: Category;

  @ApiProperty({ type: Boolean })
  hasFriendsAssigned: boolean;
}
