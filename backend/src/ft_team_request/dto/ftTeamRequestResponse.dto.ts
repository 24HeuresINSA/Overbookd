import { ApiProperty } from '@nestjs/swagger';
import { TeamFormDto } from 'src/team/dto/teamFormRequest.dto';

class CompeleteTeamDto extends TeamFormDto {
  @ApiProperty({
    type: Number,
    description: 'The id of the team',
    example: 1,
    required: true,
  })
  id: number;
}

export class FtTeamRequestResponseDto {
  @ApiProperty({
    type: Number,
    description: 'The quantity of people needed for this team',
    example: 1,
    required: true,
  })
  quantity: number;

  @ApiProperty({
    type: TeamFormDto,
    description: 'The team',
    required: true,
  })
  team: CompeleteTeamDto;
}
