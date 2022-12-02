import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidationArguments,
} from 'class-validator';

enum time_windows_type {
  ANIM = 'ANIM',
  MATOS = 'MATOS',
}

export class CreateTimeWindowDto {
  @ApiProperty({
    required: false,
    description: 'The id of the need',
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The start of the time window',
  })
  @IsDate()
  @IsNotEmpty()
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the time window',
  })
  @IsDate()
  @IsNotEmpty()
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The type of the time window',
  })
  @IsNotEmpty()
  @IsEnum(time_windows_type, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(time_windows_type)}`,
  })
  type: time_windows_type;
}
