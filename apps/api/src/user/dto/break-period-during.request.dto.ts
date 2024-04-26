import { ApiProperty } from "@nestjs/swagger";
import { Duration } from "@overbookd/period";
import { BreakDefinition } from "@overbookd/planning";
import { Type } from "class-transformer";
import { IsDate, IsNumber } from "class-validator";

type During = BreakDefinition["during"];

export class BreakPeriodDuringRequestDto implements During {
  @ApiProperty({})
  @IsDate()
  @Type(() => Date)
  start: Date;

  @ApiProperty({ type: Number, description: "Duration in hours" })
  @IsNumber()
  @Type(() => Duration.hours)
  duration: Duration;
}
