import { ApiProperty } from "@nestjs/swagger";
import { PlanningTask } from "@overbookd/assignment";
import { Status } from "@overbookd/festival-event-constants";

export class PlanningTaskResponseDto implements PlanningTask {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Boolean })
  hasFriendsAssigned: boolean;

  @ApiProperty({ type: String })
  status: Status;
}
