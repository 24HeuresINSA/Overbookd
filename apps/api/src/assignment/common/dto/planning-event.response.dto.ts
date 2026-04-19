import { ApiProperty } from "@nestjs/swagger";
import { PlanningEvent, PlanningEventTask } from "@overbookd/assignment";
import { PeriodResponseDto } from "../../../common/dto/period.response.dto";
import { PlanningTaskResponseDto } from "./planning-task.response.dto";

export class PlanningEventResponseDto
  extends PeriodResponseDto
  implements PlanningEvent
{
  @ApiProperty({ type: PlanningTaskResponseDto })
  task: PlanningEventTask;

  @ApiProperty({ type: String, required: false })
  assignmentId?: PlanningEvent["assignmentId"];

  @ApiProperty({ type: String, required: false })
  mobilizationId?: PlanningEvent["mobilizationId"];
}
