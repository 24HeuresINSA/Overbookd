import { ApiProperty } from "@nestjs/swagger";
import { CreateBreakPeriodForm } from "@overbookd/http";
import { Type } from "class-transformer";
import {
  IsDate,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateBreakPeriodRequestDto implements CreateBreakPeriodForm {
  @ApiProperty({ type: String, description: "Break period name" })
  @IsString()
  name: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @ValidateNested()
  start: Date;

  @ApiProperty({ type: Number, description: "Duration in hours" })
  @IsNumber()
  @IsPositive()
  durationInHours: number;
}
