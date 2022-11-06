import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, Min } from 'class-validator';

export class CategoryDeleteRequestDto {
  @ApiProperty({
    required: true,
    description: 'Category id',
  })
  @IsInt()
  @IsDefined()
  @Min(1)
  id: number;
}
