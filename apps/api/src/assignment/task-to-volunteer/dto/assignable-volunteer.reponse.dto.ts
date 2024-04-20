import { ApiProperty } from "@nestjs/swagger";
import { AssignableVolunteer } from "@overbookd/assignment";

export class AssignableVolunteerResponseDto implements AssignableVolunteer {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  firstname: string;

  @ApiProperty({ type: String })
  lastname: string;

  @ApiProperty({ type: String, required: false })
  nickname?: string;

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
  isRequestedOnSamePeriod: boolean;

  @ApiProperty({ type: Boolean })
  hasFriendAvailable: boolean;

  @ApiProperty({ type: Boolean })
  hasFriendAssigned: boolean;
}
