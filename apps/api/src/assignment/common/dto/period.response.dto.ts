import { ApiProperty } from "@nestjs/swagger";
import { IProvidePeriod } from "@overbookd/period";

export class PeriodResponseDto implements IProvidePeriod {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;
}
