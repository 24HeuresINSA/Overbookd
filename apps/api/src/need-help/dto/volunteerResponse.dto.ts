import { ApiProperty } from '@nestjs/swagger';
import { Volunteer } from '../needHelp.model';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { PeriodDto } from 'src/volunteer-availability/dto/period.dto';
import { VolunteerTask } from 'src/user/user.service';
import { VolunteerAssignmentDto } from 'src/user/dto/volunteerAssignment.dto';

export class VolunteerResponseDto implements Volunteer {
  @ApiProperty({ name: 'id', description: 'Volunteer id', type: Number })
  id: number;

  @ApiProperty({ description: 'Volunteer firstname', type: String })
  firstname: string;

  @ApiProperty({ description: 'Volunteer lastname', type: String })
  lastname: string;

  @ApiProperty({ description: 'Volunteer phone number', type: String })
  phone: string;

  @ApiProperty({
    description: 'Teams volunteer is member of',
    type: String,
    isArray: true,
  })
  teams: string[];

  @ApiProperty({
    description: 'Volunteer availabilities',
    type: PeriodDto,
    isArray: true,
  })
  availabilities: Period[];

  @ApiProperty({
    description: 'Volunteer tasks',
    type: VolunteerAssignmentDto,
    isArray: true,
  })
  tasks: VolunteerTask[];
}
