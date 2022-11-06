import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../interfaces';

class TeamRepresentation implements Team {
  slug: string;
  name: string;
}

export class CategoryResponseDto {
  @ApiProperty({
    required: true,
    description: 'Category id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'Category name',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Category slug',
    type: String,
  })
  slug: string;

  @ApiProperty({
    required: false,
    description: 'Parent Category id',
    type: Number,
  })
  parent?: number;

  @ApiProperty({
    required: false,
    description: 'Category owner',
    type: TeamRepresentation,
  })
  owner?: Team;
}
