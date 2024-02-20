import { ApiProperty } from "@nestjs/swagger";
import { Mobilization, TimeWindow } from "@overbookd/festival-event";
import { TimeWindowResponseDto } from "../../../common/dto/time-window.response.dto";

type BaseMobilization = TimeWindow & Pick<Mobilization, "durationSplitInHour">;

export class BaseMobilizationResponseDto
  extends TimeWindowResponseDto
  implements BaseMobilization
{
  @ApiProperty({})
  durationSplitInHour: number;
}
