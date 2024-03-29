import { ApiProperty } from "@nestjs/swagger";
import { FestivalEvent } from "@overbookd/festival-event";
import { Statistics } from "@overbookd/http";

class StatusResponseDto implements Record<FestivalEvent["status"], number> {
  @ApiProperty({ description: "envents in draft counter" })
  DRAFT: number;

  @ApiProperty({ description: "envents in review counter" })
  IN_REVIEW: number;

  @ApiProperty({ description: "validated events counter" })
  VALIDATED: number;

  @ApiProperty({ description: "refused events counter" })
  REFUSED: number;

  @ApiProperty({ description: "ready to assign events counter" })
  READY_TO_ASSIGN: number;
}

export class StatisticsResponseDto<T extends FestivalEvent>
  implements Statistics<T>
{
  @ApiProperty({ description: "team in charge of activities" })
  teamCode: string;

  @ApiProperty({
    description: "count for each activity status",
    type: StatusResponseDto,
  })
  status: Record<T["status"], number>;

  @ApiProperty({ description: "activities count" })
  total: number;
}
