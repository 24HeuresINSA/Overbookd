import { ApiProperty } from "@nestjs/swagger";
import { IProvidePeriod } from "@overbookd/period";
import { HelpingVolunteer, HelpingVolunteerAssignment } from "@overbookd/http";
import { PeriodResponseDto } from "../../common/dto/period.response.dto";

class HelpingVolunteerAssignmentDto implements HelpingVolunteerAssignment {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;
}

export class HelpingVolunteerResponseDto implements HelpingVolunteer {
  @ApiProperty({ name: "id", description: "Volunteer id", type: Number })
  id: number;

  @ApiProperty({ description: "Volunteer firstname", type: String })
  firstname: string;

  @ApiProperty({ description: "Volunteer lastname", type: String })
  lastname: string;

  @ApiProperty({
    description: "Volunteer phone number",
    type: String,
    example: "0601020304",
  })
  phone: string;

  @ApiProperty({
    description: "Teams volunteer is member of",
    type: String,
    isArray: true,
  })
  teams: string[];

  @ApiProperty({
    description: "Volunteer availabilities",
    type: PeriodResponseDto,
    isArray: true,
  })
  availabilities: IProvidePeriod[];

  @ApiProperty({
    description: "Volunteer tasks",
    type: HelpingVolunteerAssignmentDto,
    isArray: true,
  })
  assignments: HelpingVolunteerAssignment[];
}
