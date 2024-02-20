import { ApiProperty } from "@nestjs/swagger";
import { UpdateMobilization } from "@overbookd/festival-event";
import { IsOptional } from "class-validator";
import { PeriodRequestDto } from "../../../../common/dto/period.request.dto";

export class UpdateMobilizationRequestDto
  extends PeriodRequestDto
  implements UpdateMobilization
{
  @ApiProperty({
    description: "Duration split in hour",
    type: Number,
    required: false,
  })
  @IsOptional()
  durationSplitInHour: number | null;
}
