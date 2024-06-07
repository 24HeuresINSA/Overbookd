import { ApiProperty } from "@nestjs/swagger";
import { TimeWindow } from "@overbookd/festival-event";
import { PeriodResponseDto } from "../../../common/dto/period.response.dto";

export class TimeWindowResponseDto
  extends PeriodResponseDto
  implements TimeWindow
{
  @ApiProperty()
  id: string;
}
