import { ApiProperty } from "@nestjs/swagger";
import { CreateTeamRequestDto } from "../../team/dto/create-team.request.dto";
import { Team } from "../../team/team.model";

export class FtTeamRequestResponseDto {
  @ApiProperty({
    type: Number,
    description: "The quantity of people needed for this team",
    example: 1,
    required: true,
  })
  quantity: number;

  @ApiProperty({
    type: CreateTeamRequestDto,
    description: "The team",
    required: true,
  })
  team: Team;
}
