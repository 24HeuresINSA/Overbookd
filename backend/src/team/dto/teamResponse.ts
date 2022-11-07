import { ApiProperty } from '@nestjs/swagger';
import { Team } from '@prisma/client';

export class TeamResponseDto implements Team {
  @ApiProperty({
    name: 'id',
    description: 'The id of the team',
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: 'name',
    description: 'The name of the team',
    type: String,
  })
  name: string;

  @ApiProperty({
    name: 'color',
    description: 'The color of the team',
    type: String,
  })
  color: string;

  @ApiProperty({
    name: 'icon',
    description: 'The icon of the team',
    type: String,
  })
  icon: string;
}
