import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidationArguments,
} from 'class-validator';
import {
  ElectricityType,
  FaElectricityNeedWithOptionalIdRepresentation,
  electricityTypes,
} from '../fa-electricity-need.model';

export class FaElectricityNeedRequestDto
  implements FaElectricityNeedWithOptionalIdRepresentation
{
  @ApiProperty({
    required: false,
    description: 'The electricity need id',
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The type of electricity',
    example: electricityTypes.PC16_Prise_classique,
  })
  @IsDefined()
  @IsEnum(electricityTypes, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(electricityTypes)}`,
  })
  electricityType: ElectricityType;

  @ApiProperty({
    required: true,
    description: 'The device plugged in',
  })
  @IsDefined()
  @IsString()
  device: string;

  @ApiProperty({
    required: true,
    description: 'The power of electricity',
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  power: number;

  @ApiProperty({
    required: true,
    description: 'The count of device',
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  count: number;

  @ApiProperty({
    required: false,
    description: 'Any comment about electricity',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
