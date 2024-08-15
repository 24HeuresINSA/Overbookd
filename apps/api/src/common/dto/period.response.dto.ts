import { ApiProperty } from "@nestjs/swagger";
import { IProvidePeriod } from "@overbookd/time";

export class PeriodResponseDto implements IProvidePeriod {
  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;
}
