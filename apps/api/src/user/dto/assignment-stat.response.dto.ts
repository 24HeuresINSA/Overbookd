import { TaskCategory } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export type VolunteerAssignmentStat = {
  category: TaskCategory;
  duration: number;
};

export class VolunteerAssignmentStatResponseDto
  implements VolunteerAssignmentStat
{
  @ApiProperty({
    required: true,
    description: "The task category of the stats",
    type: String,
  })
  category: TaskCategory;

  @ApiProperty({
    required: true,
    description: "Assignment duration in milliseconds",
    type: Number,
  })
  duration: number;
}
