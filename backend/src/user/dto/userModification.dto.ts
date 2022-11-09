import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsMobilePhone,
  IsString,
  ValidationArguments,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Years, Departements } from './common';

export class UserModificationDto {
  @ApiProperty({
    required: false,
    description: 'The firstname of the user',
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    required: false,
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
    required: false,
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: false,
    description: 'The birthdate of the user',
  })
  @IsNotEmpty()
  birthdate: Date;

  @ApiProperty({
    required: false,
    description: 'The phone number of the user',
  })
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The departement of the user',
    enum: Departements,
  })
  @IsEnum(Departements, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Departements}`,
  })
  department: string;

  @ApiProperty({
    required: false,
    description: 'The study year of the user',
    enum: Years,
  })
  @IsEnum(Years, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of the following values: ${Years}`,
  })
  year: string;

  @ApiProperty({
    required: false,
    description: 'A coment about the user',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    required: false,
    description: 'The user has payed his contribution',
  })
  @IsNotEmpty()
  @IsBoolean()
  has_payed_contributions: boolean;

  @ApiProperty({
    required: false,
    description: 'The user profile picture',
  })
  @IsString()
  @IsNotEmpty()
  pp: string;

  @ApiProperty({
    required: false,
    description: 'The user charisma points',
  })
  @IsNotEmpty()
  @IsNumber()
  charisma: number;
}
