import { ApiProperty } from "@nestjs/swagger";
import { FriendCount } from "@overbookd/assignment";

export class FriendCountResponseDto implements FriendCount {
  @ApiProperty({
    required: true,
    description: "volunteer count",
    type: Number,
  })
  volunteerCount: number;

  @ApiProperty({
    required: true,
    description: "candidate count",
    type: Number,
  })
  candidateCount: number;
}
