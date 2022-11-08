import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsMobilePhone,
  IsString,
  IsOptional,
  Matches,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { upperCaseCharacter, number, Years, Departements } from './common';

export class UserCreationDto {
  @ApiProperty({
    required: true,
    description: 'The firstname of the user',
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    required: false,
    description: 'The nickname of the user',
  })
  nickname: string;

  @ApiProperty({
    required: true,
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    description: 'The birthdate of the user',
  })
  @IsNotEmpty()
  birthdate: Date;

  @ApiProperty({
    required: true,
    description: 'The phone number of the user',
  })
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @ApiProperty({
    required: true,
    description: 'The departement of the user',
    enum: Departements,
  })
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
  @IsEnum(Years, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Years)}`,
  })
  year: Years;

  @ApiProperty({
    required: true,
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(upperCaseCharacter, {
    message: (va: ValidationArguments) =>
      `${va.property} should have at least 1 upper case char`,
  })
  @Matches(number, {
    message: (va: ValidationArguments) =>
      `${va.property} should have at least 1 number char`,
  })
  password: string;

  @ApiProperty({
    required: false,
    description: 'A coment about the user',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
