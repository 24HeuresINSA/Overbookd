import { ApiProperty } from '@nestjs/swagger';
import { OrgaNeedsResponse } from '../orga-needs.service';

export class OrgaNeedsResponseDto implements OrgaNeedsResponse {
  @ApiProperty({
    name: 'start',
    description: 'The start of the interval',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    name: 'end',
    description: 'The end of the interval',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    name: 'assignedVolunteers',
    description: 'The number of assigned volunteers on the interval',
    type: Number,
  })
  assignedVolunteers: number;

  @ApiProperty({
    name: 'availableVolunteers',
    description: 'The number of availabled volunteers on the interval',
    type: Number,
  })
  availableVolunteers: number;

  @ApiProperty({
    name: 'requestedVolunteers',
    description: 'The number of requested volunteers on the interval',
    type: Number,
  })
  requestedVolunteers: number;
}
