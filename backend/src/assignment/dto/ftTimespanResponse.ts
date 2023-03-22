import { ApiProperty } from '@nestjs/swagger';
import { TaskCategory } from '@prisma/client';

class SimplifiedFT {
  @ApiProperty({
    required: true,
    description: 'The id of the ft',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the ft',
    type: String,
  })
  name: string;
}

export class FtTimespan {
  @ApiProperty({
    required: true,
    description: 'The id of the ft timespan',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The start of the ft timespan',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the ft timespan',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The ft timespan priority',
    type: Boolean,
  })
  hasPriority: boolean;

  @ApiProperty({
    required: true,
    description: 'The ft timespan category',
    enum: TaskCategory,
  })
  category: TaskCategory;

  @ApiProperty({
    required: true,
    description: 'The ft of the ft timespan',
    type: SimplifiedFT,
  })
  ft: SimplifiedFT;
}
