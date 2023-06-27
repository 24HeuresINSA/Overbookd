import { ApiProperty } from '@nestjs/swagger';
import { Departements, Years } from './common';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsMobilePhone,
  IsString,
  ValidationArguments,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UserModificationDto {
  @ApiProperty({
    required: false,
    description: 'The firstname of the user',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname?: string;

  @ApiProperty({
    required: false,
    description: 'The lastname of the user',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @ApiProperty({
    required: false,
    description: 'The nickname of the user',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nickname?: string;

  @ApiProperty({
    required: false,
    description: 'The email of the user',
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    required: false,
    description: 'The birthdate of the user',
  })
  @IsOptional()
  @IsNotEmpty()
  birthdate?: Date;

  @ApiProperty({
    required: false,
    description: 'The phone number of the user',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsMobilePhone()
  phone?: string;

  @ApiProperty({
    required: false,
    description: 'The departement of the user',
    enum: Departements,
  })
  @IsOptional()
  @IsEnum(Departements, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Departements}`,
  })
  department?: Departements;

  @ApiProperty({
    required: false,
    description: 'The study year of the user',
    enum: Years,
  })
  @IsOptional()
  @IsEnum(Years, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of the following values: ${Years}`,
  })
  year?: Years;

  @ApiProperty({
    required: false,
    description: 'A comment about the user',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment?: string;

  @ApiProperty({
    required: false,
    description: 'The user has payed his contribution',
  })
  @IsOptional()
  @IsBoolean()
  has_payed_contributions?: boolean;

  @ApiProperty({
    required: false,
    description: 'The user profile picture path',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pp?: string;

  @ApiProperty({
    required: false,
    description: 'The user charisma points',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  charisma?: number;
}
