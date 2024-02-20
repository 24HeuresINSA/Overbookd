import { ApiProperty } from "@nestjs/swagger";
import { TimeWindow } from "@overbookd/festival-event";
import { PeriodDto } from "./period.dto";

export class TimeWindowResponseDto extends PeriodDto implements TimeWindow {
  @ApiProperty({})
  id: string;
}
