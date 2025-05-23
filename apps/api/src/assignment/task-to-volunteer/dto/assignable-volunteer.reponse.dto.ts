import { ApiProperty } from "@nestjs/swagger";
import { AssignableVolunteer } from "@overbookd/assignment";
import {
  assignmentPreferences,
  AssignmentPreferenceType,
} from "@overbookd/preference";

export class AssignableVolunteerResponseDto implements AssignableVolunteer {
  @ApiProperty({ enum: assignmentPreferences })
  assignmentPreference: AssignmentPreferenceType;

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
  totalAssignmentDuration: number;

  @ApiProperty({ type: Number })
  assignmentDuration: number;

  @ApiProperty({ type: Boolean })
  isRequestedOnSamePeriod: boolean;

  @ApiProperty({ type: Boolean })
  hasFriendAssigned: boolean;

  @ApiProperty({ type: Boolean })
  hasAtLeastOneFriend: boolean;

  @ApiProperty({ type: Number, isArray: true })
  assignableFriendsIds: number[];
}
