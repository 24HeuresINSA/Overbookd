import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsDefined,
  ValidateNested,
} from 'class-validator';
import { Period } from '../domain/period.model';

export class PeriodDto implements Period {
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Start date of the period',
    required: true,
    type: Date,
  })
  @IsDefined()
  @IsDateString()
  start: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'End date of the period',
    required: true,
    type: Date,
  })
  @IsDefined()
  @IsDateString()
  end: Date;
}

export class CreateVolunteerAvailabilityDto {
  @ApiProperty({
    description: 'Every periods given by the volunteer',
    required: true,
    type: PeriodDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeriodDto)
  periods: PeriodDto[];
}
