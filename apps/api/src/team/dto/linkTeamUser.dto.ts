import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class LinkTeamToUserDto {
  @ApiProperty({
    required: true,
    description: 'The id of the user',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    required: true,
    description: 'The new teams of the user',
    isArray: true,
    type: String,
  })
  @IsString({ each: true })
  @IsNotEmpty()
  teams: string[];
}
