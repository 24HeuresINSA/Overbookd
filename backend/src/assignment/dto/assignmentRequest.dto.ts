import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class AssignmentRequestDto {
  @ApiProperty({
    required: true,
    description: 'The id of the volunteer',
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  volunteerId: number;

  @ApiProperty({
    required: true,
    description: 'The id of the timespan',
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  timespanId: number;

  @ApiProperty({
    required: true,
    description: 'The team code of the teamRequest',
    type: String,
  })
  @IsString()
  teamCode: string;
}
