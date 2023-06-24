import { ApiProperty } from '@nestjs/swagger';
import { SignaType } from '@prisma/client';
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
    enum: SignaType,
  })
  @IsDefined()
  @IsEnum(SignaType, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(SignaType)}`,
  })
  signa_type: SignaType;

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
