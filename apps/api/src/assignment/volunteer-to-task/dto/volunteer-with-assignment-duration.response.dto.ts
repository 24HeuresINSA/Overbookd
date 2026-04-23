import { ApiProperty } from "@nestjs/swagger";
import {
  FriendCount,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import {
  assignmentPreferences,
  AssignmentPreferenceType,
} from "@overbookd/preference";
import { UserIdentifierResponseDto } from "../../../common/dto/user-identifier.response.dto";
import { FriendCountResponseDto } from "../../common/dto/friend-count.response.dto";

export class VolunteerWithAssignmentDurationResponseDto
  extends UserIdentifierResponseDto
  implements VolunteerWithAssignmentDuration
{
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

  @ApiProperty({ enum: assignmentPreferences })
  assignmentPreference: AssignmentPreferenceType;

  @ApiProperty({ type: FriendCountResponseDto })
  friendCount: FriendCount;
}
