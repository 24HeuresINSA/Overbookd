import { ApiProperty } from "@nestjs/swagger";
import { PlanningEvent } from "@overbookd/assignment";

export class PlanningEventResponseDto implements PlanningEvent {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: String })
  task: string;
}
