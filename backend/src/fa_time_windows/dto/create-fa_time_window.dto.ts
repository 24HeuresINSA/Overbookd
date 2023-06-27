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

enum TimeWindowType {
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
  @IsEnum(TimeWindowType, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(TimeWindowType)}`,
  })
  type: TimeWindowType;
}
