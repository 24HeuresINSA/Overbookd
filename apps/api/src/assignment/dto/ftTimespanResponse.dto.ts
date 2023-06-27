import { ApiProperty } from '@nestjs/swagger';
import { TaskCategory } from '@prisma/client';
import {
  Assignee,
  AvailableTimespan as AvailableTimespan,
  FtWithLocation,
  FtWithTimespan,
  RequestedTeam,
  SimplifiedFT,
  Timespan,
  TimespanAssignee,
  TimespanWithAssignees,
} from '../types/ftTimespanTypes';

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

export class FtTimespanResponseDto implements Timespan {
  @ApiProperty({
    required: true,
    description: 'The id of the timespan',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The start of the timespan',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the timespan',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The requested teams during timespan',
    type: RequestedTeamRepresentation,
    isArray: true,
  })
  requestedTeams: RequestedTeam[];
}

export class TimespanWithFtResponseDto
  extends FtTimespanResponseDto
  implements AvailableTimespan
{
  @ApiProperty({
    required: true,
    description: 'The ft of the timespan',
    type: SimplifiedFTRepresentation,
  })
  ft: SimplifiedFT;

  @ApiProperty({
    required: true,
    description: "Indicate if some volunteer's are assigned on the timespan",
    type: Boolean,
  })
  hasFriendsAssigned: boolean;
}

export class FtWithTimespansResponseDto
  extends SimplifiedFTRepresentation
  implements FtWithTimespan
{
  @ApiProperty({
    required: true,
    description: 'The ft timespans',
    type: FtTimespanResponseDto,
    isArray: true,
  })
  timespans: FtTimespanResponseDto[];
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
  implements TimespanAssignee
{
  assignedTeam: string;
  friends: AssigneeRepresentation[];
}

export class TimespanWithAssigneesResponseDto
  extends FtTimespanResponseDto
  implements TimespanWithAssignees
{
  @ApiProperty({
    required: true,
    description: 'The ft with location',
    type: FtWithLocationRepresentation,
  })
  ft: FtWithLocation;

  @ApiProperty({
    required: true,
    description: 'Volunteer required on this timespan',
    type: AssigneeRepresentation,
    isArray: true,
  })
  requiredVolunteers: Assignee[];

  @ApiProperty({
    required: true,
    description: 'Volunteer assigned on this timespan as team member',
    type: TimespanAssigneeRepresentation,
    isArray: true,
  })
  assignees: TimespanAssignee[];
}
