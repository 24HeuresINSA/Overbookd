import { ApiProperty } from "@nestjs/swagger";
import { IProvidePeriod } from "@overbookd/time";
import { HelpingVolunteer, HelpingVolunteerAssignment } from "@overbookd/http";
import { PeriodResponseDto } from "../../common/dto/period.response.dto";

class HelpingVolunteerAssignmentDto
  extends PeriodResponseDto
  implements HelpingVolunteerAssignment
{
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;
}

export class HelpingVolunteerResponseDto implements HelpingVolunteer {
  @ApiProperty({ name: "id", description: "Volunteer id", type: Number })
  id: number;

  @ApiProperty({ description: "Volunteer first name", type: String })
  firstName: string;

  @ApiProperty({ description: "Volunteer last name", type: String })
  lastName: string;

  @ApiProperty({
    description: "Volunteer phone number",
    type: String,
    example: "0601020304",
  })
  phoneNumber: string;

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
