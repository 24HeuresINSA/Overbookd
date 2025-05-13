import { ApiProperty } from "@nestjs/swagger";
import { TaskForCalendar } from "@overbookd/http";

export class TaskForCalendarResponseDto implements TaskForCalendar {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  name: TaskForCalendar["name"];

  @ApiProperty({})
  status: TaskForCalendar["status"];

  @ApiProperty({})
  appointment: TaskForCalendar["appointment"];

  @ApiProperty({})
  assignees: TaskForCalendar["assignees"];

  @ApiProperty({})
  contacts: TaskForCalendar["contacts"];

  @ApiProperty({})
  globalInstruction: TaskForCalendar["globalInstruction"];

  @ApiProperty({})
  inChargeInstruction: TaskForCalendar["inChargeInstruction"];

  @ApiProperty({})
  timeWindow: TaskForCalendar["timeWindow"];
}
