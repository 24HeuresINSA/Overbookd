import { ApiProperty } from "@nestjs/swagger";
import { FestivalActivity } from "@overbookd/festival-activity";
import { Statistics } from "@overbookd/http";

class StatusResponseDto implements Record<FestivalActivity["status"], number> {
  @ApiProperty({ description: "activities in draft counter" })
  DRAFT: number;

  @ApiProperty({ description: "activities in review counter" })
  IN_REVIEW: number;

  @ApiProperty({ description: "validated activities counter" })
  VALIDATED: number;

  @ApiProperty({ description: "refused activities counter" })
  REFUSED: number;
}

export class StatisticsResponseDto implements Statistics {
  @ApiProperty({ description: "team in charge of activities" })
  teamCode: string;

  @ApiProperty({
    description: "count for each activity status",
    type: StatusResponseDto,
  })
  status: Record<FestivalActivity["status"], number>;

  @ApiProperty({ description: "activities count" })
  total: number;
}
