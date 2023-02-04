import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFtTeamRequestDto {
  @ApiProperty({
    example: 'bar',
    description: 'The team code',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  teamCode: string;
}
