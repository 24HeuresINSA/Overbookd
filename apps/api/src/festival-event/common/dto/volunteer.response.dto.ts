import { ApiProperty } from "@nestjs/swagger";
import type { Volunteer } from "@overbookd/festival-event";

export class VolunteerResponseDto implements Volunteer {
  @ApiProperty({
    description: "The volunteer id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The volunteer firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    description: "The volunteer lastname",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    description: "The volunteer nickname",
    type: String,
    required: false,
  })
  nickname?: string;
}
