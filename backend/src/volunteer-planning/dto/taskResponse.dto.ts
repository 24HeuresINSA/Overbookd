import { Period } from 'src/volunteer-availability/domain/period.model';
import { Task } from '../domain/task.model';
import { ApiProperty } from '@nestjs/swagger';
import { PeriodDto } from 'src/volunteer-availability/dto/period.dto';

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
}
