import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, Min } from "class-validator";

export class UpsertFtTimeWindowRequestDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: "The id of the time window",
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  id?: number;

  @ApiProperty({
    required: true,
    type: Date,
    description: "The start of the time window",
  })
  @IsDateString()
  start: Date;

  @ApiProperty({
    required: true,
    type: Date,
    description: "The end of the time window",
  })
  @IsDateString()
  end: Date;

  @ApiProperty({
    required: false,
    type: Number,
    description: "The slice time of the time window",
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  sliceTime?: number;
}
