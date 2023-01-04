import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';

enum electricity_type {
  PC16 = 'PC16_Prise_classique',
  P17_16A_MONO = 'P17_16A_MONO',
  P17_16A_TRI = 'P17_16A_TRI',
  P17_16A_TETRA = 'P17_16A_TETRA',
  P17_32A_MONO = 'P17_32A_MONO',
  P17_32A_TRI = 'P17_32A_TRI',
  P17_32A_TETRA = 'P17_32A_TETRA',
  P17_63A_MONO = 'P17_63A_MONO',
  P17_63A_TRI = 'P17_63A_TRI',
  P17_63A_TETRA = 'P17_63A_TETRA',
  P17_125A_TETRA = 'P17_125A_TETRA',
}
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
  @IsEnum(electricity_type, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(electricity_type)}`,
  })
  electricity_type: electricity_type;

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
