import { ApiProperty } from '@nestjs/swagger';
import { TaskCategory } from '@prisma/client';
import {
  Assignee,
  AvailableTimeSpan,
  FtWithLocation,
  FtWithTimeSpan,
  RequestedTeam,
  SimplifiedFT,
  TimeSpan,
  TimeSpanAssignee,
  TimeSpanWithAssignees,
} from '../types/ftTimeSpanTypes';

class SimplifiedFTRepresentation implements SimplifiedFT {
  @ApiProperty({
    required: true,
    description: 'The id of the ft',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the ft',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The ft priority',
    type: Boolean,
  })
  hasPriority: boolean;

  @ApiProperty({
    required: true,
    description: 'The ft category',
    enum: TaskCategory,
  })
  category: TaskCategory;
}

class RequestedTeamRepresentation implements RequestedTeam {
  @ApiProperty({
    required: true,
    description: 'The code of the requested team',
    type: String,
  })
  code: string;

  @ApiProperty({
    required: true,
    description: 'The quantity of the requested team members',
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

export class FtTimeSpanResponseDto implements TimeSpan {
  @ApiProperty({
    required: true,
    description: 'The id of the time span',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The start of the time span',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the time span',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The requested teams during time span',
    type: RequestedTeamRepresentation,
    isArray: true,
  })
  requestedTeams: RequestedTeam[];
}

export class TimeSpanWithFtResponseDto
  extends FtTimeSpanResponseDto
  implements AvailableTimeSpan
{
  @ApiProperty({
    required: true,
    description: 'The ft of the time span',
    type: SimplifiedFTRepresentation,
  })
  ft: SimplifiedFT;

  @ApiProperty({
    required: true,
    description: "Indicate if some volunteer's are assigned on the time span",
    type: Boolean,
  })
  hasFriendsAssigned: boolean;
}

export class FtWithTimeSpansResponseDto
  extends SimplifiedFTRepresentation
  implements FtWithTimeSpan
{
  @ApiProperty({
    required: true,
    description: 'The ft timespans',
    type: FtTimeSpanResponseDto,
    isArray: true,
  })
  timeSpans: FtTimeSpanResponseDto[];
}

class FtWithLocationRepresentation implements FtWithLocation {
  id: number;
  name: string;
  location: string;
}

class AssigneeRepresentation implements Assignee {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  teams: string[];
}

class TimespanAssigneeRepresentation
  extends AssigneeRepresentation
  implements TimeSpanAssignee
{
  assignedTeam: string;
  friends: AssigneeRepresentation[];
}

export class TimespanWithAssigneesResponseDto
  extends FtTimeSpanResponseDto
  implements TimeSpanWithAssignees
{
  @ApiProperty({
    required: true,
    description: 'The ft with location',
    type: FtWithLocationRepresentation,
  })
  ft: FtWithLocation;

  @ApiProperty({
    required: true,
    description: 'Volunteer required on this time span',
    type: AssigneeRepresentation,
    isArray: true,
  })
  requiredVolunteers: Assignee[];

  @ApiProperty({
    required: true,
    description: 'Volunteer assigned on this time span as team member',
    type: TimespanAssigneeRepresentation,
    isArray: true,
  })
  assignees: TimeSpanAssignee[];
}
