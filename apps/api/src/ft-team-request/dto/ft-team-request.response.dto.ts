import { ApiProperty } from "@nestjs/swagger";
import { TeamRequestDto } from "../../team/dto/team.request.dto";

class CompeleteTeamDto extends TeamRequestDto {
  @ApiProperty({
    type: Number,
    description: "The id of the team",
    example: 1,
    required: true,
  })
  id: number;
}

export class FtTeamRequestResponseDto {
  @ApiProperty({
    type: Number,
    description: "The quantity of people needed for this team",
    example: 1,
    required: true,
  })
  quantity: number;

  @ApiProperty({
    type: TeamRequestDto,
    description: "The team",
    required: true,
  })
  team: CompeleteTeamDto;
}
