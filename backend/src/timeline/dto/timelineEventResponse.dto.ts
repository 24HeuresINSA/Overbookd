import { ApiProperty } from '@nestjs/swagger';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { TimelineEvent, TimelineFa, TimelineFt } from '../timeline.model';

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
    description: 'The timespans of the FT',
    type: Object,
    isArray: true,
  })
  timespans: Period[];

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
