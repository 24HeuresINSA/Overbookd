import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate } from 'class-validator';

export class CreateTimeWindowDto {
  @ApiProperty({
    required: true,
    description: 'The start of the time window',
  })
  @IsDate()
  @IsNotEmpty()
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the time window',
  })
  @IsDate()
  @IsNotEmpty()
  end: Date;
}
