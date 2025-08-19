import { ApiProperty } from "@nestjs/swagger";
import { TimeWindow, Location } from "@overbookd/festival-event";
import { PlanningTask } from "@overbookd/http";
import { DRAFT, IN_REVIEW } from "@overbookd/festival-event-constants";
import { TimeWindowResponseDto } from "../../../festival-event/common/dto/time-window.response.dto";

class LocationResponseDto implements Location {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  name: string;
}

export class PlanningTaskResponseDto implements PlanningTask {
  @ApiProperty({
    type: TimeWindowResponseDto,
  })
  timeWindow: TimeWindow;

  @ApiProperty({
    type: Number,
    description: "Festival task id",
  })
  id: number;

  @ApiProperty({
    type: String,
    description: "Festival task name",
  })
  name: string;

  @ApiProperty({
    enum: [DRAFT, IN_REVIEW],
    description: "Festival task status",
  })
  status: PlanningTask["status"];

  @ApiProperty({
    type: LocationResponseDto,
    nullable: true,
    description: "Festival task appointment location",
  })
  appointment: PlanningTask["appointment"];
}
