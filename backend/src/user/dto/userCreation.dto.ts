import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsMobilePhone,
  IsString,
  Matches,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import {
  upperCaseCharacter,
  number,
  yearEnum,
  departementEnum,
} from './common';

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
    enum: Departments,
  })
  @IsEnum(Departments, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(Departments)}`,
  })
  department: Departments;

  @ApiProperty({
    required: true,
    description: 'The study year of the user',
    enum: yearEnum,
  })
  @IsEnum(yearEnum, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of the following values: ${yearEnum}`,
  })
  year: string;

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
  @IsNotEmpty()
  comment: string;
}
