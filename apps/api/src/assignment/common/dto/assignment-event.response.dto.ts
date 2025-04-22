import { ApiProperty } from "@nestjs/swagger";
import type { AssignmentEvent, PlanningTask } from "@overbookd/assignment";
import { PeriodResponseDto } from "../../../common/dto/period.response.dto";
import { PlanningTaskResponseDto } from "./planning-task.response.dto";

export class AssignmentEventResponseDto
  extends PeriodResponseDto
  implements AssignmentEvent
{
  @ApiProperty({ type: PlanningTaskResponseDto })
  task: PlanningTask;

  @ApiProperty({ type: String, required: false })
  assignmentId: AssignmentEvent["assignmentId"];

  @ApiProperty({ type: String, required: false })
  mobilizationId: AssignmentEvent["mobilizationId"];
}
