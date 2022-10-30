import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt } from 'class-validator';

export class CategoryDeleteRequestDto {
  @ApiProperty({
    required: true,
    description: 'Category id',
  })
  @IsInt()
  @IsDefined()
  id: number;
}
