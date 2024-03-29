import { ApiProperty } from "@nestjs/swagger";
import { AvailableVolunteer, Volunteer } from "../model/volunteer.model";

export class VolunteerResponseDto implements Volunteer {
  @ApiProperty({
    required: true,
    description: "The id of the volunteer",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The firstname of the volunteer",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: "The lastname of the volunteer",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: "The charisma of the volunteer",
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    description: "The comment of the volunteer",
    type: String,
  })
  comment?: string;

  @ApiProperty({
    required: true,
    description: "The team codes of the volunteer",
    type: String,
    isArray: true,
  })
  teams: string[];

  @ApiProperty({
    required: false,
    description: "The duration in milliseconds the volunteer is assigned",
    type: Number,
  })
  assignmentDuration: number;
}

export class AvailableVolunteerResponseDto
  extends VolunteerResponseDto
  implements AvailableVolunteer
{
  @ApiProperty({
    required: false,
    description: "Has friends available on the same time span",
    type: Boolean,
  })
  friendAvailable: boolean;

  @ApiProperty({
    description:
      "Whether the volunteer is requested by a non validated FT on the same period",
    type: Boolean,
  })
  isRequestedOnSamePeriod: boolean;

  @ApiProperty({
    description: "Has friends assigned on the same time span",
    type: Boolean,
  })
  hasFriendAssigned: boolean;
}
