import { ApiProperty } from "@nestjs/swagger";
import { MultiPlanningVolunteer, PlanningTask } from "@overbookd/http";
import { PeriodResponseDto } from "../../../common/dto/period.response.dto";
import { IProvidePeriod } from "@overbookd/time";
import { PlanningTaskResponseDto } from "./planning-task.response.dto";
import { AssignmentEvent, BreakPeriod } from "@overbookd/assignment";
import { AssignmentEventResponseDto } from "../../../assignment/common/dto/assignment-event.response.dto";
import { BreakPeriodResponseDto } from "../../../assignment/common/dto/break-period.response.dto";

export class MultiPlanningVolunteerResponseDto implements MultiPlanningVolunteer {
  @ApiProperty({
    description: "The volunteer's id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The volunteer's first name",
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: "The volunteer's last name",
    type: String,
  })
  lastName: string;

  @ApiProperty({
    description: "The volunteer's teams",
    type: [String],
  })
  teams: string[];

  @ApiProperty({
    description: "The volunteer's availabilities",
    type: PeriodResponseDto,
    isArray: true,
  })
  availabilities: IProvidePeriod[];

  @ApiProperty({
    description: "The volunteer's assignments",
    type: AssignmentEventResponseDto,
    isArray: true,
  })
  assignments: AssignmentEvent[];

  @ApiProperty({
    description: "The volunteer's tasks not linked to an assignment",
    type: PlanningTaskResponseDto,
    isArray: true,
  })
  tasks: PlanningTask[];

  @ApiProperty({
    description: "The volunteer's break periods",
    type: BreakPeriodResponseDto,
    isArray: true,
    required: false,
  })
  breaks?: BreakPeriod[];
}
