import { ApiProperty } from "@nestjs/swagger";
import { IProvidePeriod } from "@overbookd/period";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class PeriodRequestDto implements IProvidePeriod {
  @ApiProperty({})
  @IsDate()
  @Type(() => Date)
  start: Date;

  @ApiProperty({})
  @IsDate()
  @Type(() => Date)
  end: Date;
}
