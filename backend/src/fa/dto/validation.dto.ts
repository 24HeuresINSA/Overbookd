import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class validationDto {
  @ApiProperty({
    required: true,
    description: 'The id of the team who is validating the fa',
  })
  @IsNotEmpty()
  @IsNumber()
  team_id: number;
}
