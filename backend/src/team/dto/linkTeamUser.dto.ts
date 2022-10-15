import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class LinkTeamToUserDto {
  @ApiProperty({
    required: true,
    description: 'The id of the user',
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    required: true,
    description: 'The new teams of the user',
  })
  @IsString({ each: true })
  @IsNotEmpty()
  teams: string[];
}
