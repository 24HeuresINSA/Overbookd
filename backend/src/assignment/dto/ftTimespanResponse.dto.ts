import { ApiProperty } from '@nestjs/swagger';
import { TaskCategory } from '@prisma/client';
import {
  FtWithTimespan,
  RequestedTeam,
  SimplifiedFT,
  Timespan,
  TimespanWithFt,
} from '../types/ftTimespanTypes';

class SimplifiedFTRepresentation implements SimplifiedFT {
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

class RequestedTeamRepresentation implements RequestedTeam {
  @ApiProperty({
    required: true,
    description: 'The code of the requested team',
    type: String,
  })
  code: string;

  @ApiProperty({
    required: true,
    description: 'The quantity of the requested team members',
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    required: true,
    description: 'Number of assignments',
    type: Number,
  })
  assignmentCount: number;
}

export class FtTimespanResponseDto implements Timespan {
  @ApiProperty({
    required: true,
    description: 'The id of the timespan',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The start of the timespan',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the timespan',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The requested teams during timespan',
    type: RequestedTeamRepresentation,
    isArray: true,
  })
  requestedTeams: RequestedTeam[];

  @ApiProperty({
    required: false,
    description: 'The ft timespan assignees ids',
    type: Number,
    isArray: true,
  })
  assignees?: number[];
}

export class TimespanWithFtResponseDto
  extends FtTimespanResponseDto
  implements TimespanWithFt
{
  @ApiProperty({
    required: true,
    description: 'The ft of the timespan',
    type: SimplifiedFTRepresentation,
  })
  ft: SimplifiedFT;
}

export class FtWithTimespansResponseDto
  extends SimplifiedFTRepresentation
  implements FtWithTimespan
{
  @ApiProperty({
    required: true,
    description: 'The ft timespans',
    type: FtTimespanResponseDto,
    isArray: true,
  })
  timespans: FtTimespanResponseDto[];
}
