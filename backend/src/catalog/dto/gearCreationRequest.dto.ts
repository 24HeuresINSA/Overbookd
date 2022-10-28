import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsString, MinLength } from 'class-validator';

export class GearCreationRequestDto {
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
  @IsInt()
  category?: number;
}
