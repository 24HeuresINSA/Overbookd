import { ApiProperty } from '@nestjs/swagger';
import {
  TimelineEvent,
  TimelineFa,
  TimelineFt,
  TimelineTimeWindow,
  TimelineTimespan,
} from '../timeline.model';

class TimelineFaDto implements TimelineFa {
  @ApiProperty({
    required: true,
    description: 'The id of the FA',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the FA',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The team code in charge of the FA',
    type: String,
  })
  team: string;
}

class TimelineTimespanDto implements TimelineTimespan {
  @ApiProperty({
    required: true,
    description: 'The start date of the Timespan',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end date of the Timespan',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The id of the Timespan',
    type: Number,
  })
  id: number;
}

class TimelineTimeWindowDto implements TimelineTimeWindow {
  @ApiProperty({
    required: true,
    description: 'The start date of the Timewindow',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end date of the Timewindow',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The timespans of the TimeWindow',
    type: TimelineTimespanDto,
    isArray: true,
  })
  timespans: TimelineTimespan[];
}

class TimelineFtDto implements TimelineFt {
  @ApiProperty({
    required: true,
    description: 'The id of the FT',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the FT',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The timewindows of the FT',
    type: TimelineTimeWindowDto,
    isArray: true,
  })
  timeWindows: TimelineTimeWindow[];

  @ApiProperty({
    required: true,
    description: 'Indicate priority FT',
    type: Boolean,
  })
  hasPriority: boolean;
}

export class TimelineEventResponseDto implements TimelineEvent {
  @ApiProperty({
    required: true,
    description: 'The FA of the timeline',
    type: TimelineFaDto,
  })
  fa: TimelineFaDto;

  @ApiProperty({
    required: true,
    description: 'The FTs of the timeline',
    type: TimelineFtDto,
    isArray: true,
  })
  fts: TimelineFtDto[];
}
