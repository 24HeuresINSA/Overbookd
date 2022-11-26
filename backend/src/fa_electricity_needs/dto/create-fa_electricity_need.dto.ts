import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export enum electricity_type {
  PC16 = 'PC16',
  P17_16A_MONO = 'P17_16A_MONO',
  P17_16A_TRI = 'P17_16A_TRI',
  P17_32A_MONO = 'P17_32A_MONO',
  P17_32A_TRI = 'P17_32A_TRI',
  P17_32A_TETRA = 'P17_32A_TETRA',
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
  electricity_type: electricity_type;

  @ApiProperty({
    required: true,
    description: 'The power of electricity',
  })
  @IsNumber()
  @IsNotEmpty()
  power: number;

  @ApiProperty({
    required: false,
    description: 'Amy comment about electricity',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
