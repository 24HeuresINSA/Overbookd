import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt } from 'class-validator';
import { CategoryCreationRequestDto } from './categoryCreationRequest.dto';

export class CategoryUpdateRequestDto extends CategoryCreationRequestDto {
  @ApiProperty({
    required: true,
    description: 'Category id',
  })
  @IsInt()
  @IsDefined()
  id: number;
}
