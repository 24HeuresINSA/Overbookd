import { ApiProperty } from "@nestjs/swagger";
import { TimeWindow } from "@overbookd/festival-event";

export class TimeWindowResponseDto implements TimeWindow {
  @ApiProperty({
    description: "Festival activity time window id",
  })
  id: string;

  @ApiProperty({
    description: "Festival activity time window start date",
    type: Date,
  })
  start: Date;

  @ApiProperty({
    description: "Festival activity time window end date",
    type: Date,
  })
  end: Date;
}
