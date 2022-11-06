import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

//Placeholder pour le moment, à définir mieux
export enum Security_pass_schedule {
  JOUR = 'JOUR',
  NUIR = 'NUIT',
  JOUR_NUIT = 'JOUR_NUIT',
}
export class CreateSecurityPassDto {
  @ApiProperty({
    required: true,
    description: 'The id of the corresponding FA',
    type: Number,
  })
  @IsNumber()
  fa_id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the person who needs the security pass',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @ApiProperty({
    required: false,
    description: 'The phone number of the person who needs the security pass',
    type: String,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The license plate of the vehicule',
    type: String,
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  license_plate: string;

  @ApiProperty({
    required: true,
    description: 'the email of the person who needs the security pass',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  email: string;

  @ApiProperty({
    required: false,
    description: 'Any comment needed',
    type: String,
  })
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty({
    required: true,
    description: 'the entity/company of the person who needs the security pass',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  entity: string;

  @ApiProperty({
    required: true,
    description: 'The reason for this demand',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    required: true,
    description: 'Schedule for this pass',
    enum: Security_pass_schedule,
  })
  schedule: Security_pass_schedule; //required
}
