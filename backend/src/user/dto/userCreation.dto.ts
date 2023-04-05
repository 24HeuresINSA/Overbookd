import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { Departements, OneNumber, Years, upperCaseCharacter } from './common';

export class UserCreationDto {
  @ApiProperty({
    required: true,
    description: 'The firstname of the user',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the user',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    required: false,
    description: 'The nickname of the user',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nickname?: string;

  @ApiProperty({
    required: true,
    description: 'The email of the user',
  })
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    required: true,
    description: 'The birthdate of the user',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  @ApiProperty({
    required: true,
    description: 'The phone number of the user',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber('FR')
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The team id of the user',
  })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  teamId?: number;

  @ApiProperty({
    required: false,
    description: 'The departement of the user',
    enum: Departements,
  })
  @IsOptional()
  @IsDefined()
  @IsEnum(Departements, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Departements)}`,
  })
  department?: Departements;

  @ApiProperty({
    required: false,
    description: 'The study year of the user',
    enum: Years,
  })
  @IsOptional()
  @IsDefined()
  @IsEnum(Years, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Years)}`,
  })
  year?: Years;

  @ApiProperty({
    required: true,
    description: 'The password of the user',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(upperCaseCharacter, {
    message: (va: ValidationArguments) =>
      `${va.property} should have at least 1 upper case char`,
  })
  @Matches(OneNumber, {
    message: (va: ValidationArguments) =>
      `${va.property} should have at least 1 number char`,
  })
  password: string;

  @ApiProperty({
    required: false,
    description: 'A comment about the user',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
