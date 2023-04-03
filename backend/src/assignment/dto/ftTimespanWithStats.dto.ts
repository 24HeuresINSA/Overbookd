import { ApiProperty } from '@nestjs/swagger';

class TeamRequestStatDto {
  @ApiProperty({
    required: true,
    description: 'The code of the requested team',
    type: String,
  })
  teamCode: string;

  @ApiProperty({
    required: true,
    description: 'The quantity of the requested team',
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

export class FtTimespanWithStatsDto {
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
    isArray: true,
    type: TeamRequestStatDto,
  })
  teamRequests: TeamRequestStatDto[];
}
