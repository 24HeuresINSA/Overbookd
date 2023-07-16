import { Period } from '@overbookd/period';
import { Assignment, Task, Volunteer } from '../domain/task.model';
import { ApiProperty } from '@nestjs/swagger';
import { PeriodDto } from '../../../src/volunteer-availability/dto/period.dto';

class VolunteerRepresentation implements Volunteer {
  @ApiProperty({
    name: 'id',
    description: 'volunteer id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: 'name',
    description: 'volunteer name',
    type: String,
  })
  name: string;
}

class AssignmentRepresentation implements Assignment {
  @ApiProperty({
    name: 'period',
    description: 'period volunteers are assigned',
    type: PeriodDto,
  })
  period: Period;

  @ApiProperty({
    name: 'volunteers',
    description: "volunteer's assigned during the period",
    type: VolunteerRepresentation,
    isArray: true,
  })
  volunteers: Volunteer[];
}

export class TaskResponseDto implements Task {
  @ApiProperty({
    name: 'name',
    description: 'task name',
    type: String,
  })
  name: string;

  @ApiProperty({
    name: 'description',
    description: 'task description',
    type: String,
  })
  description: string;

  @ApiProperty({
    name: 'period',
    description: 'task period',
    type: PeriodDto,
  })
  period: Period;

  @ApiProperty({
    name: 'location',
    description: 'task location',
    type: String,
  })
  location: string;

  @ApiProperty({
    name: 'assignments',
    description: 'other volunteers assigned during similar periods',
    type: AssignmentRepresentation,
    isArray: true,
  })
  assignments: Assignment[];
}
