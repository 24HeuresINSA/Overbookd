import { ApiProperty } from "@nestjs/swagger";
import { DuringBreakPeriods } from "@overbookd/http";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsPositive, ValidateNested } from "class-validator";

export class BreakPeriodDuringRequestDto implements DuringBreakPeriods {
  @ApiProperty({})
  @IsDate()
  @Type(() => Date)
  @ValidateNested()
  start: Date;

  @ApiProperty({ type: Number, description: "Duration in hours" })
  @IsNumber()
  @IsPositive()
  durationInHours: number;
}
