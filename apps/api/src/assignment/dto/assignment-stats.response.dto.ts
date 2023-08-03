import {
  VolunteerAssignmentDto,
  VolunteerAssignmentStat,
} from '../../user/dto/volunteerAssignment.dto';
import { AssignmentStats } from '../assignment.service';
import { ApiProperty } from '@nestjs/swagger';

export class AssignmentStatsResponseDto implements AssignmentStats {
  @ApiProperty({
    required: true,
    description: 'volunteer firstname',
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'volunteer lastname',
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: 'volunteer assignments stats',
    type: VolunteerAssignmentDto,
  })
  stats: VolunteerAssignmentStat[];
}
