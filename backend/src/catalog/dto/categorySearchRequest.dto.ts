import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { SearchCategory } from '../interfaces';

export class CategorySearchRequestDto implements SearchCategory {
  @ApiProperty({
    required: false,
    description: 'Category name',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Owner name',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  owner?: string;
}
