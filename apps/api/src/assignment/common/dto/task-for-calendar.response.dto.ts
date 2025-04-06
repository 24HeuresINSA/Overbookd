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
  contacts: TaskForCalendar["contacts"];

  @ApiProperty({})
  globalInstructions: TaskForCalendar["globalInstructions"];

  @ApiProperty({})
  inChargeInstructions: TaskForCalendar["inChargeInstructions"];

  @ApiProperty({})
  timeWindow: TaskForCalendar["timeWindow"];
}
