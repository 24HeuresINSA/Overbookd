import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import { SearchFa } from '../fa.service';
import { faStatus, FaStatus } from '../fa.model';

export class FASearchRequestDto implements SearchFa {
  @ApiProperty({
    required: false,
    description: 'FA delete status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isDeleted = false;

  @ApiProperty({
    required: false,
    description: 'FA status',
    enum: faStatus,
  })
  @IsOptional()
  @IsEnum(faStatus, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(faStatus)}`,
  })
  status?: FaStatus;
}
