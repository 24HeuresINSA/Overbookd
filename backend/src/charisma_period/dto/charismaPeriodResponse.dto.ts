import { ApiProperty } from '@nestjs/swagger';
import { CharismaPeriod } from '@prisma/client';

export class CharismaPeriodResponseDto implements CharismaPeriod {
  @ApiProperty({
    required: true,
    description: 'The id of the Charisma Period',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the Charisma Period',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'The description of the Charisma Period',
    type: String,
  })
  description: string;

  @ApiProperty({
    required: true,
    description: 'The charisma associated the Charisma Period',
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    required: true,
    description: 'The start date of the Charisma Period',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end date of the Charisma Period',
    type: Date,
  })
  end: Date;
}
