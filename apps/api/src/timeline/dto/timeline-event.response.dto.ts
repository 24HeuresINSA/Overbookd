import { ApiProperty } from "@nestjs/swagger";
import {
  TimelineActivity,
  TimelineMobilization,
  TimelineTask,
  TimelineEvent,
  TimelineAssignment,
  TimelineAssignee,
} from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/time";

class PeriodDto implements IProvidePeriod {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;
}

class TimelineAssigneeDto implements TimelineAssignee {
  @ApiProperty({
    required: true,
    description: "The assignee's first name",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: "The assignee's last name",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: "The assignee's teams",
    type: String,
    isArray: true,
  })
  teams: string[];

  @ApiProperty({
    required: true,
    description: "The assignee's phone number",
    type: String,
  })
  phone: string;
}

class TimelineAssignmentDto extends PeriodDto implements TimelineAssignment {
  @ApiProperty({
    required: true,
    description: "The assignees of the assignment",
    type: TimelineAssigneeDto,
    isArray: true,
  })
  assignees: TimelineAssignee[];
}

class TimelineActivityDto implements TimelineActivity {
  @ApiProperty({
    required: true,
    description: "The id of the activity",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The name of the activity",
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "The team code in charge of the activity",
    type: String,
  })
  team: string;
}

class TimelineMobilizationDto
  extends PeriodDto
  implements TimelineMobilization
{
  @ApiProperty({
    description: "The assignment periods of the mobilization",
    type: PeriodDto,
    isArray: true,
  })
  assignments: TimelineAssignmentDto[];
}

class TimelineTaskDto implements TimelineTask {
  @ApiProperty({
    required: true,
    description: "The id of the task",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The name of the task",
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "The mobilizations of the task",
    type: TimelineMobilizationDto,
    isArray: true,
  })
  mobilizations: TimelineMobilization[];

  @ApiProperty({
    required: true,
    description: "Indicate priority of the task",
    type: Boolean,
  })
  topPriority: boolean;

  @ApiProperty({
    required: true,
    description: "The appointment of the task",
    type: String,
  })
  appointment: string;
}

export class TimelineEventResponseDto implements TimelineEvent {
  @ApiProperty({
    required: true,
    description: "The FA of the timeline",
    type: TimelineActivityDto,
  })
  activity: TimelineActivityDto;

  @ApiProperty({
    required: true,
    description: "The FTs of the timeline",
    type: TimelineTaskDto,
    isArray: true,
  })
  tasks: TimelineTaskDto[];
}
