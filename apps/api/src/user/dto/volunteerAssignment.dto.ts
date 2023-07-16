import { TaskCategory } from '@prisma/client';
import { VolunteerTask } from '../user.service';
import { ApiProperty } from '@nestjs/swagger';
import { FtStatus, ftStatuses } from '../../../src/ft/ft.model';

class FtRepresentation {
  id: number;
  name: string;
  @ApiProperty({ type: String, enum: ftStatuses })
  status: FtStatus;
}

export class VolunteerAssignmentDto implements VolunteerTask {
  ft: FtRepresentation;
  start: Date;
  end: Date;
}

export interface VolunteerAssignmentStat {
  category: TaskCategory;
  duration: number;
}

export class VolunteerAssignmentStatResponseDto
  implements VolunteerAssignmentStat
{
  @ApiProperty({
    required: true,
    description: 'The task category of the stats',
    type: String,
  })
  category: TaskCategory;

  @ApiProperty({
    required: true,
    description: 'Assignment duration in milliseconds',
    type: Number,
  })
  duration: number;
}
