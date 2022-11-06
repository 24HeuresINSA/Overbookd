import { ApiProperty } from '@nestjs/swagger';
import { SimplifiedCategory } from '../interfaces';

class SimplifiedCategoryRepresentation implements SimplifiedCategory {
  id: number;
  name: string;
  slug: string;
}

export class GearResponseDto {
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
}
