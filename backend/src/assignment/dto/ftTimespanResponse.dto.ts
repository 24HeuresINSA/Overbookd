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

class RequestedTeam {
  @ApiProperty({
    required: true,
    description: 'The code of the requested team',
    type: String,
  })
  code: string;

  @ApiProperty({
    required: true,
    description: 'The quantity of the requested team',
    type: Number,
  })
  quantity: number;
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
    type: RequestedTeam,
    isArray: true,
  })
  requestedTeams: RequestedTeam[];
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
    type: FtTimespan,
    isArray: true,
  })
  timespans: FtTimespan[];
}
