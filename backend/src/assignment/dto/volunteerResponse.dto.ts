import { ApiProperty } from '@nestjs/swagger';

class CategoryAssignmentStat {
  @ApiProperty({
    required: true,
    description: 'The category of the assignment',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The number of assignments for this category',
    type: Number,
  })
  count: number;
}

export class VolunteerResponseDto {
  @ApiProperty({
    required: true,
    description: 'The id of the volunteer',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The firstname of the volunteer',
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the volunteer',
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: 'The charisma of the volunteer',
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    description: 'The comment of the volunteer',
    type: String,
  })
  comment?: string;

  @ApiProperty({
    required: true,
    description: 'The team codes of the volunteer',
    type: String,
    isArray: true,
  })
  teams: string[];

  @ApiProperty({
    required: false,
    description: 'The Category assignment stat of the volunteer',
    type: CategoryAssignmentStat,
  })
  categoryStat?: CategoryAssignmentStat;
}
