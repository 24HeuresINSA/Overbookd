import { ApiProperty } from "@nestjs/swagger";
import { PlanningEventTask } from "@overbookd/assignment";
import { Status } from "@overbookd/festival-event-constants";

export class PlanningTaskResponseDto implements PlanningEventTask {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  status: Status;

  @ApiProperty({ type: Boolean })
  hasFriendsAssigned: boolean;
}
