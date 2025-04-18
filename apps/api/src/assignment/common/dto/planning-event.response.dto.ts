import { ApiProperty } from "@nestjs/swagger";
import { PlanningEvent, PlanningTask } from "@overbookd/assignment";
import { Status } from "@overbookd/festival-event-constants";
import { PeriodResponseDto } from "../../../common/dto/period.response.dto";

class PlanningTaskResponseDto implements PlanningTask {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  status: Status;
}

export class PlanningEventResponseDto
  extends PeriodResponseDto
  implements PlanningEvent
{
  @ApiProperty({ type: PlanningTaskResponseDto })
  task: PlanningTask;

  @ApiProperty({ type: String, required: false })
  assignmentId?: PlanningEvent["assignmentId"];

  @ApiProperty({ type: String, required: false })
  mobilizationId?: PlanningEvent["mobilizationId"];
}
