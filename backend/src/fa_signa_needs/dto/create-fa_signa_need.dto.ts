import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidationArguments,
} from 'class-validator';
import { SignaType, signaType } from '../faSignaNeed.model';

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
    enum: signaType,
  })
  @IsDefined()
  @IsEnum(signaType, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(signaType)}`,
  })
  signaType: SignaType;

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
