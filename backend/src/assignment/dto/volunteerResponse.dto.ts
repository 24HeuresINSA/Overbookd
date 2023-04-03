import { ApiProperty } from '@nestjs/swagger';
import { Volunteer } from '../types/volunteerTypes';

export class VolunteerResponseDto implements Volunteer {
  @ApiProperty({
    required: true,
    description: 'The id of the volunteer',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The firstname of the volunteer',
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the volunteer',
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: 'The charisma of the volunteer',
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    description: 'The comment of the volunteer',
    type: String,
  })
  comment?: string;

  @ApiProperty({
    required: true,
    description: 'The team codes of the volunteer',
    type: String,
    isArray: true,
  })
  teams: string[];

  @ApiProperty({
    required: false,
    description: 'The category task count of the volunteer',
    type: Number,
  })
  assignments: number;

  @ApiProperty({
    required: false,
    description: 'Has friends available on the same timespan',
    type: Boolean,
  })
  friendAvailable?: boolean;

  @ApiProperty({
    description: 'Whether the volunteer has a user request on the timespan',
    type: Boolean,
  })
  hasUserRequest?: boolean;
}
