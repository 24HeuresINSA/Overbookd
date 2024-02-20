import { ApiProperty } from "@nestjs/swagger";
import { IProvidePeriod } from "@overbookd/period";

export class PeriodResponseDto implements IProvidePeriod {
  @ApiProperty({})
  start: Date;

  @ApiProperty({})
  end: Date;
}
