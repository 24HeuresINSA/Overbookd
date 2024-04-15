import { ApiProperty } from "@nestjs/swagger";
import { OrgaNeedDetails, OrgaNeedTask } from "@overbookd/http";

class OrgaNeedTaskDto implements OrgaNeedTask {
  @ApiProperty({ type: Number })
  id: OrgaNeedTask["id"];

  @ApiProperty({ type: String })
  name: OrgaNeedTask["name"];

  @ApiProperty({ type: Number })
  count: OrgaNeedTask["count"];
}

export class OrgaNeedDetailsDto implements OrgaNeedDetails {
  @ApiProperty({
    name: "start",
    description: "The start of the interval",
    type: Date,
  })
  start: Date;

  @ApiProperty({
    name: "end",
    description: "The end of the interval",
    type: Date,
  })
  end: Date;

  @ApiProperty({
    name: "assignedVolunteers",
    description: "The number of assigned volunteers on the interval",
    type: Number,
  })
  assignedVolunteers: number;

  @ApiProperty({
    name: "availableVolunteers",
    description: "The number of available volunteers on the interval",
    type: Number,
  })
  availableVolunteers: number;

  @ApiProperty({
    name: "requestedVolunteers",
    description: "The number of requested volunteers on the interval",
    type: Number,
  })
  requestedVolunteers: number;

  @ApiProperty({
    name: "tasks",
    description: "The tasks with volunteers on the interval",
    type: OrgaNeedTaskDto,
    isArray: true,
  })
  tasks: OrgaNeedTask[];
}
