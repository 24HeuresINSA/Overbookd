import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt } from 'class-validator';

export class GearDeletionRequestDto {
  @ApiProperty({
    required: true,
    description: 'Gear id that will be deleted',
  })
  @IsInt()
  @IsDefined()
  id: number;
}
