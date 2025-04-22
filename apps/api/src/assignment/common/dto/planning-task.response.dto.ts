import { ApiProperty } from "@nestjs/swagger";
import { Task as PlanningTask } from "@overbookd/assignment/src/assign-task-to-volunteer/funnel/planning";
import { Status } from "@overbookd/festival-event-constants";

export class PlanningTaskResponseDto implements PlanningTask {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  status: Status;
}
