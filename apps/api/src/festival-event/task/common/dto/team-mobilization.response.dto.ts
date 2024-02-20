import { ApiProperty } from "@nestjs/swagger";
import { TeamMobilization } from "@overbookd/festival-event";

export class TeamMobilizationResponseDto implements TeamMobilization {
  @ApiProperty({})
  count: number;

  @ApiProperty({})
  team: string;
}
