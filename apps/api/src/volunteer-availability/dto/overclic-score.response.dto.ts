import { ApiProperty } from "@nestjs/swagger";
import { OverClicScore } from "@overbookd/volunteer-availability";
import { OverClicUserResponseDto } from "./overclic-user.response.dto";

export class OverClicScoreResponseDto implements OverClicScore {
  @ApiProperty({
    required: true,
    description: "The id of the OverClic score",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The score achieved on OverClic",
    type: Number,
  })
  score: number;

  @ApiProperty({
    required: true,
    description: "The date at which the score was saved",
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    required: true,
    description: "The user who achieved the score",
    type: OverClicUserResponseDto,
  })
  user: OverClicUserResponseDto;
}
