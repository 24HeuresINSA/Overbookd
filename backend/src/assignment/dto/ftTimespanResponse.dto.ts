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

  @ApiProperty({
    required: true,
    description: 'The ft priority',
    type: Boolean,
  })
  hasPriority: boolean;

  @ApiProperty({
    required: true,
    description: 'The ft category',
    enum: TaskCategory,
  })
  category: TaskCategory;
}

class FtTimespan {
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
    description: 'The ft timespan requested teams',
    type: [String],
  })
  requestedTeams: string[];
}

export class TimespanWithFtResponseDto extends FtTimespan {
  @ApiProperty({
    required: true,
    description: 'The ft of the ft timespan',
    type: SimplifiedFT,
  })
  ft: SimplifiedFT;
}

export class FtWithTimespansResponseDto extends SimplifiedFT {
  @ApiProperty({
    required: true,
    description: 'The ft timespans',
    type: [FtTimespan],
  })
  timespans: FtTimespan[];
}
