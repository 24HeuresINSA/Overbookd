import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CategoryFormRequestDto {
  @ApiProperty({
    required: true,
    description: 'Category name',
  })
  @IsString()
  @IsDefined()
  @MinLength(3)
  name: string;

  @ApiProperty({
    required: false,
    description: 'Category owner slug',
  })
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiProperty({
    required: false,
    description: 'Parent ctaegory id',
  })
  @IsOptional()
  @IsInt()
  parent?: number;
}
