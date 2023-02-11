import { ApiProperty } from '@nestjs/swagger';
import { CharismaGroup } from '@prisma/client';

export class CharismaGroupResponseDto implements CharismaGroup {
  @ApiProperty({
    required: true,
    description: 'The id of the Charisma Group',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the Charisma Group',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'The description of the Charisma Group',
    type: String,
  })
  description: string;

  @ApiProperty({
    required: true,
    description: 'The charisma associated the Charisma Group',
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    required: true,
    description: 'The start date of the Charisma Group',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end date of the Charisma Group',
    type: Date,
  })
  end: Date;
}
