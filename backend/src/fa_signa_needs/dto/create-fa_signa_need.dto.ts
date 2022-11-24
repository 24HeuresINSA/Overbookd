import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export enum signa_type {
  BANNIERE = 'BANNIERE',
  PANCARTE = 'PANCARTE',
  PANNEAU = 'PANNEAU',
}

export class CreateFaSignaNeedDto {
  @ApiProperty({
    required: true,
    description: 'The type of signalisation',
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
