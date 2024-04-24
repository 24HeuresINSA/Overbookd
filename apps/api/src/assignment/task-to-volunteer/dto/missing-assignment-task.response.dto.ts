import { ApiProperty } from "@nestjs/swagger";
import { MissingAssignmentTask } from "@overbookd/assignment";
import { Category } from "@overbookd/festival-event-constants";
import { TaskIdentifierResponseDto } from "./task-identifier.response.dto";

export class MissingAssignmentTaskResponseDto
  extends TaskIdentifierResponseDto
  implements MissingAssignmentTask
{
  @ApiProperty({ type: String })
  inChargeTeam: string;

  @ApiProperty({ type: Boolean })
  topPriority: boolean;

  @ApiProperty({ type: String, required: false })
  category?: Category;

  @ApiProperty({ type: String, isArray: true })
  teams: string[];
}
