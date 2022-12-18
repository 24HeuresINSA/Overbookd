import { ApiProperty } from '@nestjs/swagger';
import { Gear, SimplifiedCategory, Team } from '../interfaces';

export class SimplifiedCategoryRepresentation implements SimplifiedCategory {
  id: number;
  name: string;
  path: string;
}

class TeamRepresentation implements Team {
  name: string;
  code: string;
}

export class GearResponseDto implements Gear {
  @ApiProperty({
    required: true,
    description: 'Gear id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'Gear name',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Gear slug',
    type: String,
  })
  slug: string;

  @ApiProperty({
    required: false,
    description: 'Gear category',
    type: SimplifiedCategoryRepresentation,
  })
  category?: SimplifiedCategory;

  @ApiProperty({
    required: false,
    description: 'Gear owner',
    type: TeamRepresentation,
  })
  owner?: Team;

  @ApiProperty({
    required: false,
    description: 'Gear reference code',
    type: String,
  })
  code?: string;
}
