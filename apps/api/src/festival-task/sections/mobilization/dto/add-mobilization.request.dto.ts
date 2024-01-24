import { ApiProperty } from "@nestjs/swagger";
import { TeamMobilization } from "@overbookd/festival-event";
import { AddMobilizationForm } from "@overbookd/http";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { TeamMobilizationRequestDto } from "./team-mobilization.request.dto";
import { Type } from "class-transformer";

export class AddMobilizationRequestDto implements AddMobilizationForm {
  @ApiProperty({
    description: "Start date of the mobilization",
    type: Date,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start: Date;

  @ApiProperty({
    description: "End date of the mobilization",
    type: Date,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end: Date;

  @ApiProperty({
    description: "Duration split in hour",
    type: Number,
    required: false,
  })
  durationSplitInHour: number | null;

  @ApiProperty({
    description: "List of volunteers id",
    type: Number,
    isArray: true,
  })
  @IsNumber({}, { each: true })
  volunteers: number[];

  @ApiProperty({
    description: "List of teams",
    type: TeamMobilizationRequestDto,
    isArray: true,
  })
  teams: TeamMobilization[];
}
