import { ApiProperty } from '@nestjs/swagger';
import { Assignment } from '../assignment.service';

export class AssignmentResponseDto implements Assignment {
  @ApiProperty({
    required: true,
    description: 'The id of the assignee',
    type: Number,
  })
  assigneeId: number;

  @ApiProperty({
    required: true,
    description: 'The id of the timespan',
    type: Number,
  })
  timespanId: number;

  @ApiProperty({
    required: false,
    description: 'The id of the team request',
    type: Number,
  })
  teamRequestId?: number;

  @ApiProperty({
    required: false,
    description: 'The id of the user request',
    type: Number,
  })
  userRequestId?: number;
}
