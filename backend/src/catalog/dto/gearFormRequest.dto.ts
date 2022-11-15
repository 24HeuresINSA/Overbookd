import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { GearForm } from '../catalog.service';

export class GearFormRequestDto implements GearForm {
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
    description: 'Category id to link gear to',
  })
  @IsOptional()
  @IsInt()
  category?: number;
}
