import { ApiProperty } from '@nestjs/swagger';

export class OrgaNeedsResponseDto {
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
    name: 'availableVolunteers',
    description: 'The number of volunteers available',
    type: Number,
  })
  availableVolunteers?: number;
}
