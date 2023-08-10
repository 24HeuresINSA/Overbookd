import { ApiProperty } from '@nestjs/swagger';
import { IProvidePeriod } from '@overbookd/period';
import { Volunteer } from '../need-help.model';
import { PeriodDto } from '../../volunteer-availability/dto/period.dto';
import { VolunteerTask } from '../../user/user.model';
import { VolunteerAssignmentDto } from '../../user/dto/volunteer-assignment-stat.response.dto';

export class VolunteerResponseDto implements Volunteer {
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
    type: PeriodDto,
    isArray: true,
  })
  availabilities: IProvidePeriod[];

  @ApiProperty({
    description: "Volunteer tasks",
    type: VolunteerAssignmentDto,
    isArray: true,
  })
  tasks: VolunteerTask[];
}
