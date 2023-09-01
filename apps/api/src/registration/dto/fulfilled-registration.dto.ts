import { ApiProperty } from "@nestjs/swagger";
import { FulfilledRegistration, Teams } from "@overbookd/registration";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
} from "class-validator";

export class FulfilledRegistrationDto implements FulfilledRegistration {
  @ApiProperty({ example: "test@example.com" })
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  firstname: string;

  @IsDefined()
  @IsString()
  lastname: string;

  @IsDefined()
  @IsString()
  password: string;

  @ApiProperty({ example: "0701020304" })
  @IsDefined()
  @IsString()
  mobilePhone: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    required: true,
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  birthdate: Date;

  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ isArray: true, type: String, example: '["karna", "teckos"]' })
  @IsArray()
  @Type(() => String)
  teams: Teams;
}
