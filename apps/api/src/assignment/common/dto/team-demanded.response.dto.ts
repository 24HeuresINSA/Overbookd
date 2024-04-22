import { ApiProperty } from "@nestjs/swagger";
import { TeamDemanded } from "@overbookd/assignment";

export class TeamDemandedResponseDto implements TeamDemanded {
  @ApiProperty({ type: String })
  team: string;

  @ApiProperty({ type: Number })
  demand: number;
}
