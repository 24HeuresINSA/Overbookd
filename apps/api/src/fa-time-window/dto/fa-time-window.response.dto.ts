import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsDateString, IsDefined } from "class-validator";
import { FaTimeWindowRepresentation } from "../fa-time-window.model";

export class FaTimeWindowResponseDto implements FaTimeWindowRepresentation {
  @ApiProperty({
    required: false,
    description: "Time window id",
  })
  @IsDefined()
  @IsNumber()
  id: number;

  @ApiProperty({
    required: true,
    description: "Time window start",
  })
  @IsDefined()
  @IsDateString()
  start: Date;

  @ApiProperty({
    required: true,
    description: "Time window end",
  })
  @IsDefined()
  @IsDateString()
  end: Date;
}
