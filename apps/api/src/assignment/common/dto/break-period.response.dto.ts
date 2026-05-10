import { BreakPeriod } from "@overbookd/assignment";
import { PeriodResponseDto } from "../../../common/dto/period.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class BreakPeriodResponseDto
  extends PeriodResponseDto
  implements BreakPeriod
{
  @ApiProperty({ type: String })
  name: string;
}
