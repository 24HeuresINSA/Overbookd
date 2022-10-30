import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsString, MinLength } from 'class-validator';

export class CategoryCreationRequestDto {
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
  @IsString()
  owner?: string;

  @ApiProperty({
    required: false,
    description: 'Parent ctaegory id',
  })
  @IsInt()
  parent?: number;
}
