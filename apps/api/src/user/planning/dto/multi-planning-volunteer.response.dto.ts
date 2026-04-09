import { ApiProperty } from "@nestjs/swagger";
import { AssignmentEvent } from "@overbookd/assignment";
import { MultiPlanningVolunteer, PlanningTask } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/time";
import { AssignmentEventResponseDto } from "../../../assignment/common/dto/assignment-event.response.dto";
import { PeriodResponseDto } from "../../../common/dto/period.response.dto";
import { PlanningTaskResponseDto } from "./planning-task.response.dto";

export class MultiPlanningVolunteerResponseDto implements MultiPlanningVolunteer {
  @ApiProperty({
    description: "The volunteer's id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The volunteer's firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    description: "The volunteer's lastname",
    type: String,
  })
  lastname: string;

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
}
