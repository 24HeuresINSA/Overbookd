import { ApiProperty } from "@nestjs/swagger";
import { AssignmentTeam } from "@overbookd/assignment";

export class AssignmentTeamResponseDto implements AssignmentTeam {
  @ApiProperty({ type: String })
  team: string;

  @ApiProperty({ type: Number })
  demand: number;

  @ApiProperty({ type: Number })
  assigned: number;
}
