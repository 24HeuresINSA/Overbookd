import { ApiProperty } from "@nestjs/swagger";
import { UpdateMobilization } from "@overbookd/festival-event";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class UpdateMobilizationRequestDto implements UpdateMobilization {
  @ApiProperty({
    description: "Start date of the mobilization",
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start: Date;

  @ApiProperty({
    description: "End date of the mobilization",
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end: Date;

  @ApiProperty({
    description: "Duration split in hour",
    type: Number,
    required: false,
  })
  @IsOptional()
  durationSplitInHour: number | null;
}
