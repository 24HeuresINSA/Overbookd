import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, MinLength } from 'class-validator';

export class GearSearchRequestDto {
  @ApiProperty({
    required: true,
    description: 'Gear name',
  })
  @IsString()
  @IsDefined()
  @MinLength(3)
  name: string;

  @ApiProperty({
    required: false,
    description: 'Category name',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  category?: string;
}
