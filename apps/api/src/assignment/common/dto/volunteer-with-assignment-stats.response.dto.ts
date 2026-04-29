import {
  AssignmentStat,
  AssignmentStats,
  VolunteerWithAssignmentStats,
} from "@overbookd/http";
import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Category } from "@overbookd/festival-event-constants";
import { FriendCountResponseDto } from "./friend-count.response.dto";
import { FriendCount } from "@overbookd/assignment";
import { UserIdentifierResponseDto } from "../../../common/dto/user-identifier.response.dto";

class AssignmentStatResponseDto implements AssignmentStat {
  @ApiProperty({
    required: true,
    description: "category",
    type: String,
  })
  category: Category;

  @ApiProperty({
    required: true,
    description: "duration",
    type: Number,
  })
  duration: number;
}

export class AssignmentStatsResponseDto implements AssignmentStats {
  @ApiProperty({
    required: true,
    description: "volunteer assignments stats",
    type: AssignmentStatResponseDto,
  })
  stats: AssignmentStat[];

  @ApiProperty({
    required: true,
    description: "volunteer assignments with friends",
    type: Number,
  })
  withFriendsAssignmentDuration: number;

  @ApiProperty({
    required: true,
    description: "volunteer friends count",
    type: FriendCountResponseDto,
  })
  friendCount: FriendCount;
}

export class VolunteerWithAssignmentStatsResponseDto
  extends IntersectionType(
    AssignmentStatsResponseDto,
    UserIdentifierResponseDto,
  )
  implements VolunteerWithAssignmentStats
{
  @ApiProperty({
    required: true,
    description: "volunteer charisma",
    type: Number,
  })
  charisma: number;
}
