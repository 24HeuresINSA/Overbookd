import { ApiProperty } from "@nestjs/swagger";
import type { Volunteer } from "@overbookd/festival-event";

export class VolunteerResponseDto implements Volunteer {
  @ApiProperty({
    description: "The volunteer id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The volunteer first name",
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: "The volunteer last name",
    type: String,
  })
  lastName: string;

  @ApiProperty({
    description: "The volunteer nickname",
    type: String,
    required: false,
  })
  nickname?: string;
}
