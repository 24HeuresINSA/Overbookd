import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeamDto {
  @ApiProperty({
    required: false,
    description: 'The name of the team',
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'The color of the team',
  })
  color: string;

  @ApiProperty({
    required: false,
    description: 'The icon of the team',
  })
  icon: string;
}
