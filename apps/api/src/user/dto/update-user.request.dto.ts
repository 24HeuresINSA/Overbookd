import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserUpdateForm } from '@overbookd/user';

export class UpdateUserRequestDto implements UserUpdateForm {
  @ApiProperty({
    required: false,
    description: "The firstname of the user",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname?: string;

  @ApiProperty({
    required: false,
    description: "The lastname of the user",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @ApiProperty({
    required: false,
    description: "The nickname of the user",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nickname?: string;

  @ApiProperty({
    required: false,
    description: "The email of the user",
    example: "john@doe.com",
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    required: false,
    description: "The birthdate of the user",
  })
  @IsOptional()
  @IsNotEmpty()
  birthdate?: Date;

  @ApiProperty({
    required: false,
    description: "The phone number of the user",
    example: "0601020304",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsMobilePhone()
  phone?: string;

  @ApiProperty({
    required: false,
    description: "A comment about the user",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment?: string;

  @ApiProperty({
    required: false,
    description: "The user has payed his contribution",
  })
  @IsOptional()
  @IsBoolean()
  hasPayedContributions?: boolean;

  @ApiProperty({
    required: false,
    description: "The user profile picture path",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profilePicture?: string;

  @ApiProperty({
    required: false,
    description: "The user charisma points",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  charisma?: number;
}
