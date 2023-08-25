import { ApiProperty } from "@nestjs/swagger";
import { TeamRequestDto } from "../../team/dto/team.request.dto";

class CompeleteTeamDto extends TeamRequestDto {
  @ApiProperty({
    type: String,
    description: "The code of the team",
    example: "soft",
    required: true,
  })
  code: string;
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
