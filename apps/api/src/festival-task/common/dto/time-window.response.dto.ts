import { ApiProperty } from "@nestjs/swagger";
import { TimeWindow } from "@overbookd/festival-event";

export class TimeWindowResponseDto implements TimeWindow {
  @ApiProperty({
    description: "Festival task time window id",
  })
  id: string;

  @ApiProperty({
    description: "Festival task time window start date",
    type: Date,
  })
  start: Date;

  @ApiProperty({
    description: "Festival task time window end date",
    type: Date,
  })
  end: Date;
}
