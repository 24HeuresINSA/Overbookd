import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import { FaStatus, faStatuses } from '../fa.model';
import { SearchFa } from '../fa.service';

export class FaSearchRequestDto implements SearchFa {
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
    enum: faStatuses,
  })
  @IsOptional()
  @IsEnum(faStatuses, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(faStatuses)}`,
  })
  status?: FaStatus;
}
