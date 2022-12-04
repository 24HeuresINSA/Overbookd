import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { SearchGear } from '../interfaces';

export class GearSearchRequestDto implements SearchGear {
  @ApiProperty({
    required: false,
    description: 'Gear name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Category name',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  category?: string;

  @ApiProperty({
    required: false,
    description: 'Owner name',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  owner?: string;
}
