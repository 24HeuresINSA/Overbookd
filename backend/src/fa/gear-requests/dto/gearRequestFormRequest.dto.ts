import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, Min } from 'class-validator';
import { CreateGearRequestForm } from '../gearRequests.service';

export class GearRequestFormRequestDto
  implements Omit<CreateGearRequestForm, 'seekerId'>
{
  @ApiProperty({
    required: true,
    description: 'Gear Request quantity',
    type: Number,
  })
  @IsDefined()
  @Min(1)
  quantity: number;

  @ApiProperty({
    required: true,
    description: 'Gear Id requested',
    type: Number,
  })
  @IsDefined()
  @Min(1)
  gearId: number;

  @ApiProperty({
    required: true,
    description: 'Gear Request start rental period',
    type: Date,
  })
  @IsDefined()
  @IsDateString()
  start: Date;

  @ApiProperty({
    required: true,
    description: 'Gear Request end rental period',
    type: Date,
  })
  @IsDefined()
  @IsDateString()
  end: Date;
}
