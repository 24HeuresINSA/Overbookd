import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFtTeamRequestDto {
  @ApiProperty({
    type: Number,
    description: 'The quantity of people needed for this team',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @ApiProperty({
    type: String,
    description: 'The code of the team',
    example: 'bar',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  teamCode: string;
}
