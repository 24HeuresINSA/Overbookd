import { ApiProperty } from '@nestjs/swagger';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { Timeline, TimelineFa, TimelineFt } from '../timeline.model';

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
}

export class TimelineResponseDto implements Timeline {
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
