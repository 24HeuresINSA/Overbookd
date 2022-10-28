import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt } from 'class-validator';
import { GearCreationRequestDto } from './gearCreationRequest.dto';

export class GearUpdateRequestDto extends GearCreationRequestDto {
  @ApiProperty({
    required: true,
    description: 'Gear id',
  })
  @IsInt()
  @IsDefined()
  id: number;
}
