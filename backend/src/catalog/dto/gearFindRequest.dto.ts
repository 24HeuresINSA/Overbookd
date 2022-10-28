import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt } from 'class-validator';

export class GearFindRequestDto {
  @ApiProperty({
    required: true,
    description: 'Gear id that will be searched for',
  })
  @IsInt()
  @IsDefined()
  id: number;
}
