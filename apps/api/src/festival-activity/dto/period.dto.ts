import { ApiProperty } from "@nestjs/swagger";
import { IProvidePeriod } from "@overbookd/period";

export class PeriodDto implements IProvidePeriod {
  @ApiProperty({})
  start: Date;

  @ApiProperty({})
  end: Date;
}
