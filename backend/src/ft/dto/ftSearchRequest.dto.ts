import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import { FtStatus, esftStatus } from '../ft.model';
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
    enum: esftStatus,
  })
  @IsOptional()
  @IsEnum(esftStatus, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(esftStatus)}`,
  })
  status?: FtStatus;
}
