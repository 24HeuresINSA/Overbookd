import { ApiProperty } from "@nestjs/swagger";
import {
  TimelineActivity,
  TimelineMobilization,
  TimelineTask,
  TimelineEvent,
} from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";

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

class PeriodDto implements IProvidePeriod {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;
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
  assignments: PeriodDto[];
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
