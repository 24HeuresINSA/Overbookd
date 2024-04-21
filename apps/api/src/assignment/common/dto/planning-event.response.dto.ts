import { ApiProperty } from "@nestjs/swagger";
import { PlanningEvent, PlanningTask } from "@overbookd/assignment";
import { Status } from "@overbookd/festival-event-constants";

class PlanningTaskResponseDto implements PlanningTask {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  status: Status;
}

export class PlanningEventResponseDto implements PlanningEvent {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: PlanningTaskResponseDto })
  task: PlanningTask;
}
