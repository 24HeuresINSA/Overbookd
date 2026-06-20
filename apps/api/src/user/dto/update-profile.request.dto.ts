import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "@overbookd/user";
import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateProfileRequestDto implements Partial<Profile> {
  @ApiProperty({
    required: false,
    description: "The first name of the user",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    required: false,
    description: "The last name of the user",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

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
    description: "The date of birth of the user",
  })
  @IsOptional()
  @IsNotEmpty()
  dateOfBirth?: Date;

  @ApiProperty({
    required: false,
    description: "The phone number of the user",
    example: "0601020304",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber?: string;

  @ApiProperty({
    required: false,
    description: "A comment about the user",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment?: string;
}
