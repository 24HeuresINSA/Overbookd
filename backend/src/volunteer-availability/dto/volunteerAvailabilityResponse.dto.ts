import { ApiProperty } from '@nestjs/swagger';
import { Period } from './createVolunteerAvailability.dto';

export class VolunteerAvailabilityResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the user',
    required: true,
    type: Number,
  })
  userId: number;

  @ApiProperty({
    example: [
      {
        start: '2021-01-01T00:00:00.000Z',
        end: '2021-01-01T00:00:00.000Z',
      },
    ],
    description: 'Every periods given by the volunteer',
    required: true,
    type: Period,
    isArray: true,
  })
  periods: Period[];
}
