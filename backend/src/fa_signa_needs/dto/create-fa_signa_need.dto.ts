import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  ValidationArguments,
} from 'class-validator';

export enum signa_type {
  BANNIERE = 'BANNIERE',
  PANCARTE = 'PANCARTE',
  PANNEAU = 'PANNEAU',
}

export class CreateFaSignaNeedDto {
  @ApiProperty({
    required: false,
    description: 'The id of the need',
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The type of signalisation',
  })
  @IsEnum(signa_type, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(signa_type)}`,
  })
  signa_type: signa_type;

  @ApiProperty({
    required: true,
    description: 'The text to display',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    required: true,
    description: 'The number of signa',
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    required: false,
    description: 'Amy comment abput signa',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
