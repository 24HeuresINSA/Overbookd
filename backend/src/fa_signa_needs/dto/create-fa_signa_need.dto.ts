import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  ValidationArguments,
  IsDefined,
  Min,
} from 'class-validator';

enum signa_type {
  BANNIERE = 'BANNIERE',
  PANCARTE = 'PANCARTE',
  PANNEAU = 'PANNEAU',
}

export class CreateFaSignaNeedDto {
  @ApiProperty({
    required: false,
    description: 'The id of the need',
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The type of signalisation',
    enum: signa_type,
  })
  @IsDefined()
  @IsEnum(signa_type, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(signa_type)}`,
  })
  signa_type: signa_type;

  @ApiProperty({
    required: true,
    description: 'The text to display',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    required: true,
    description: 'The number of signa',
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  count: number;

  @ApiProperty({
    required: false,
    description: 'Amy comment abput signa',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
