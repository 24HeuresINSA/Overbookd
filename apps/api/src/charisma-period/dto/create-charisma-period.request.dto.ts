import { ApiProperty } from "@nestjs/swagger";
import { CharismaPeriod } from "@overbookd/http";
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateCharismaPeriodRequestDto implements CharismaPeriod {
  @ApiProperty({
    required: true,
    description: "The name of the Charisma Period",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: "The description of the Charisma Period",
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: true,
    description: "The charisma associated the Charisma Period",
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  charisma: number;

  @ApiProperty({
    required: true,
    description: "The start date of the Charisma Period",
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @ApiProperty({
    required: true,
    description: "The end date of the Charisma Period",
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  end: Date;
}
