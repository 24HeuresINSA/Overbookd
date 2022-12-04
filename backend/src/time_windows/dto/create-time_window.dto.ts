import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidationArguments,
  IsDateString,
  IsDefined,
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
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The start of the time window',
  })
  @IsDefined()
  @IsDateString()
  @IsNotEmpty()
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the time window',
  })
  @IsDefined()
  @IsDateString()
  @IsNotEmpty()
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The type of the time window',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(time_windows_type, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(time_windows_type)}`,
  })
  type: time_windows_type;
}
