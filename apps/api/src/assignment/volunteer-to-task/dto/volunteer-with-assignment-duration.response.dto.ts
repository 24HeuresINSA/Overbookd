import { ApiProperty } from "@nestjs/swagger";
import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";

export class VolunteerWithAssignmentDurationResponseDto
  implements VolunteerWithAssignmentDuration
{
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  firstname: string;

  @ApiProperty({ type: String })
  lastname: string;

  @ApiProperty({ type: Number })
  charisma: number;

  @ApiProperty({ type: String, required: false })
  comment?: string;

  @ApiProperty({ type: String, required: false })
  note?: string;

  @ApiProperty({ type: String, isArray: true })
  teams: string[];

  @ApiProperty({ type: Number })
  assignmentDuration: number;

  @ApiProperty({ type: Boolean })
  hasFriends: boolean;
}
