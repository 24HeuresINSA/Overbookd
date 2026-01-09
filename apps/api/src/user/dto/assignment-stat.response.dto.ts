import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@overbookd/festival-event-constants";

export type VolunteerAssignmentStat = {
  category: Category;
  duration: number;
};

export class VolunteerAssignmentStatResponseDto implements VolunteerAssignmentStat {
  @ApiProperty({
    required: true,
    description: "The task category of the stats",
    type: String,
  })
  category: Category;

  @ApiProperty({
    required: true,
    description: "Assignment duration in milliseconds",
    type: Number,
  })
  duration: number;
}
