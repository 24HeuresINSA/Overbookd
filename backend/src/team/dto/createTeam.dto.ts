import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    required: true,
    description: 'The name of the team',
  })
  @IsString()
  @IsNotEmpty()
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
