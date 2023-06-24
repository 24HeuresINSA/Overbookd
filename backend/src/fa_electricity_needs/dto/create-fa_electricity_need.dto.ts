import { ApiProperty } from '@nestjs/swagger';
import { ElectricityType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';

export class CreateFaElectricityNeedDto {
  @ApiProperty({
    required: false,
    description: 'The id of the need',
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The type of electricity',
  })
  @IsEnum(ElectricityType, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(ElectricityType)}`,
  })
  electricity_type: ElectricityType;

  @ApiProperty({
    required: false,
    description: 'The device plugged in',
  })
  @IsString()
  @IsOptional()
  device?: string;

  @ApiProperty({
    required: true,
    description: 'The power of electricity',
  })
  @IsNumber()
  @IsNotEmpty()
  power: number;

  @ApiProperty({
    required: false,
    description: 'The count of device',
  })
  @IsNumber()
  @IsOptional()
  count?: number;

  @ApiProperty({
    required: false,
    description: 'Amy comment about electricity',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
