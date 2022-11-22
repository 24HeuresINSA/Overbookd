import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidationArguments,
  IsOptional,
  IsDefined,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';
import { Years, Departements, upperCaseCharacter, OneNumber } from './common';

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
    required: true,
    description: 'The departement of the user',
    enum: Departements,
  })
  @IsDefined()
  @IsEnum(Departements, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Departements)}`,
  })
  department: Departements;

  @ApiProperty({
    required: true,
    description: 'The study year of the user',
    enum: Years,
  })
  @IsDefined()
  @IsEnum(Years, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Years)}`,
  })
  year: Years;

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
