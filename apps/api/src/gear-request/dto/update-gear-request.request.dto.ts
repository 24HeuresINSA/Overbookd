import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, Min } from 'class-validator';
import { UpdateGearRequest } from '../gear-request.model';

export class UpdateGearRequestRequestDto implements UpdateGearRequest {
  @ApiProperty({
    required: false,
    description: 'Gear Request quantity',
    type: Number,
  })
  @IsOptional()
  @Min(1)
  quantity: number;

  @ApiProperty({
    required: false,
    description: 'Gear Request start rental period',
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  start: Date;

  @ApiProperty({
    required: false,
    description: 'Gear Request end rental period',
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  end: Date;
}
