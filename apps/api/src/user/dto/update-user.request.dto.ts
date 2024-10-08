import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { UserUpdateForm } from "@overbookd/user";

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
    description: "The user profile picture path",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profilePicture?: string;

  @ApiProperty({
    required: false,
    description: "Notes from 'humain' members about user",
  })
  @IsOptional()
  @IsString()
  note?: string | null;
}
