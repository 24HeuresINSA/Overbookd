import { AssignmentStat, VolunteerWithAssignmentStats } from "@overbookd/http";
import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@overbookd/festival-event-constants";

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

export class VolunteerWithAssignmentStatsResponseDto
  implements VolunteerWithAssignmentStats
{
  @ApiProperty({
    required: true,
    description: "volunteer id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "volunteer firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: "volunteer lastname",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: "volunteer charisma",
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    required: true,
    description: "volunteer assignments stats",
    type: AssignmentStatResponseDto,
  })
  stats: AssignmentStat[];
}
