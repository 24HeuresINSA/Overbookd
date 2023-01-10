import { ApiProperty } from '@nestjs/swagger';
import { ftStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import { SearchFt } from '../ft.service';

export class FTSearchRequestDto implements SearchFt {
  @ApiProperty({
    required: false,
    description: 'FT delete status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isDeleted = false;

  @ApiProperty({
    required: false,
    description: 'FT status',
    enum: ftStatus,
  })
  @IsOptional()
  @IsEnum(ftStatus, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(ftStatus)}`,
  })
  status?: ftStatus;
}
