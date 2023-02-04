import { ApiProperty } from '@nestjs/swagger';
import { TeamFormDto } from 'src/team/dto/teamFormRequest.dto';

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
  team: TeamFormDto;
}
