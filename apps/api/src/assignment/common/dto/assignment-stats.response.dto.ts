import { AssignmentStats } from "@overbookd/http";
import {
  VolunteerAssignmentDto,
  VolunteerAssignmentStat,
} from "../../../user/dto/volunteer-assignment-stat.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AssignmentStatsResponseDto implements AssignmentStats {
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
    type: VolunteerAssignmentDto,
  })
  stats: VolunteerAssignmentStat[];
}
