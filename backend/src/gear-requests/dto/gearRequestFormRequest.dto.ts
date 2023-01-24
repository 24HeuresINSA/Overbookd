import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsOptional, Min } from 'class-validator';
import {
  CreateGearRequestForm,
  ExistingPeriodGearRequestForm,
  NewPeriodCreateGearRequestForm,
} from '../gearRequests.service';

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
    description: 'Gear Request rental period id',
    type: Number,
  })
  @IsOptional()
  @Min(1)
  periodId?: number;

  @ApiProperty({
    required: true,
    description: 'Gear Request start rental period',
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  start?: Date;

  @ApiProperty({
    required: true,
    description: 'Gear Request end rental period',
    type: Date,
  })
  @IsOptional()
  @IsDateString()
  end?: Date;
}

export class ExistingPeriodGearRequestFormRequestDto
  implements Omit<ExistingPeriodGearRequestForm, 'seekerId'>
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
    description: 'Gear Request rental period id',
    type: Number,
  })
  @IsDefined()
  @Min(1)
  periodId: number;
}

export class NewPeriodGearRequestFormRequestDto
  implements Omit<NewPeriodCreateGearRequestForm, 'seekerId'>
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
