import { ApiProperty } from '@nestjs/swagger';
import { FaStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import { SearchFa } from '../fa.service';

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
    enum: FaStatus,
  })
  @IsOptional()
  @IsEnum(FaStatus, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(FaStatus)}`,
  })
  status?: FaStatus;
}
