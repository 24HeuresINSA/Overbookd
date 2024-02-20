import { ApiProperty } from "@nestjs/swagger";
import { TeamMobilization } from "@overbookd/festival-event";
import { AddMobilizationForm } from "@overbookd/http";
import { IsArray, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { TeamMobilizationRequestDto } from "./team-mobilization.request.dto";
import { Type } from "class-transformer";
import { PeriodRequestDto } from "../../../../common/dto/period.request.dto";

export class AddMobilizationRequestDto
  extends PeriodRequestDto
  implements AddMobilizationForm
{
  @ApiProperty({
    description: "Duration split in hour",
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  durationSplitInHour: number | null;

  @ApiProperty({
    description: "List of volunteers id",
    type: Number,
    isArray: true,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  volunteers: number[];

  @ApiProperty({
    description: "List of teams",
    type: TeamMobilizationRequestDto,
    isArray: true,
  })
  @IsArray()
  @Type(() => TeamMobilizationRequestDto)
  @ValidateNested({ each: true })
  teams: TeamMobilization[];
}
