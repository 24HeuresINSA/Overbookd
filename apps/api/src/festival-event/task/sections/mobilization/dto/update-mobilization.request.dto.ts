import { ApiProperty } from "@nestjs/swagger";
import { UpdateMobilization } from "@overbookd/festival-event";
import { IsOptional } from "class-validator";
import { PeriodDto } from "../../../../common/dto/period.dto";

export class UpdateMobilizationRequestDto
  extends PeriodDto
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
