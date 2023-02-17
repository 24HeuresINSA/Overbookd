import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined } from 'class-validator';

export class Period {
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Start date of the period',
    required: true,
    type: Date,
  })
  @IsDefined()
  @IsDateString()
  start: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'End date of the period',
    required: true,
    type: Date,
  })
  @IsDefined()
  @IsDateString()
  end: Date;
}

export class CreateVolunteerAvailabilityDto {
  @ApiProperty({
    description: 'Every periods given by the volunteer',
    required: true,
    type: Period,
    isArray: true,
  })
  @IsDefined()
  periods: Period[];
}
